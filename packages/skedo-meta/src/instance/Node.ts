import { ComponentMeta } from "../meta/ComponentMeta"
import { Logger, Rect, Emiter } from '@skedo/utils'
import { PropMeta } from '../meta/PropMeta'
import { Topic } from "../Topic"
import { NodeData, NodeInstanceJsonStructure, JsonNode} from "../standard.types"
import { BoxDescriptor } from "../BoxDescriptor"
import { Map as ImmutableMap, fromJS } from "immutable"
import { MountPoint } from "./MountPoint"
import { Bridge } from "../Bridge"
import { CordNew } from "./Cord.new"
import { LinkedNode } from "./LinkedNode"

// reactive / hooks
// meta (immutable, data-flow, virtualdom)

/**
 * 节点数据
 * Immutable管理可以让数据的存储、回滚变简单
 */
class InstanceData extends Emiter<Topic> {
  protected data: NodeData

	constructor(data : NodeData) {
    super()
		this.data = data
	}

  public setInstanceData(key : string, value : any) : void {
    this.data = this.data.set(key, value)
  }
  
  public updateInstanceData(key : string, updator : (value : any) => any)  {
    this.data = this.data.updateIn([key], updator)
  }

  public updateInstanceByPath (path: Array<string>, value: any){
    this.data = PropMeta.setPropValue(
      path,
      this.data,
      value
    )
    this.emit(Topic.NodePropUpdated)
  }

  public getData(){
    return this.data
  }

  
  public getBox() : BoxDescriptor{
    return this.data.get('box')
  }

  public getType() {
    return this.data.get("type")
  }

  public getName(){
    return this.data.get('name')
  }

  public getGroup(){
    return this.data.get('group')
  }



  public getParent(): Node {
    return this.data.get("parent")
  }

  public getStyle(key: string): any {
    return this.data.getIn(["style", key])
  }

  public isMoving(): boolean {
    return this.data.get("isMoving")
  }

  public getId(): number {
    return this.data.get("id")
  }

  public getWH() : [number, number]{
    const box = this.getBox()
    return [box.width.toNumber(), box.height.toNumber()]
  }




  public setXY = (x: number, y: number) => {
    this.getBox().left.set(x)
    this.getBox().top.set(y)
  }

  public setXYWH = (x : number, y : number, w : number, h : number) => {
    const box = this.getBox()
    box.left.set(x)
    box.top.set(y)
    box.width.set(w)
    box.height.set(h)
  }

  public setWH = (w : number, h : number) => {
    const box = this.getBox()
    box.width.set(w)
    box.height.set(h)
  }
}

/**
 * 最核心的一个类
 * 类似VirtualDOM，代表页面上的一个节点
 */
export class Node extends InstanceData
{
  meta: ComponentMeta
  private logger: Logger
  private mountPoint?: MountPoint
  private receiving: Node | null
  private remoteCache? : Map<string, any>
  bridgeCache? : Bridge 
  private tmpData : any
  level: number = 0

  private refs : Array<LinkedNode> = []
  // #region 初始化
  constructor(
    meta: ComponentMeta,
    data : NodeData
  ) {
    super(data)
    this.getBox().setNode(this)
    this.logger = new Logger("node")
    this.meta = meta
    this.receiving = null
  }

  //#endregion

  public addRef(node : LinkedNode) {
    this.refs.push(node)
  }


  public getRefs() {
    return this.refs
  }

  // #region runtime
  getMountPoint() {
    return this.mountPoint
  }

  mount(ele: HTMLElement, cord :CordNew) {
    this.mountPoint = new MountPoint(ele, this, cord)
  }
  // #endregion

  // #region 访问器

  getChildren(): Array<Node | LinkedNode> {
    const children : Array<Node> = this.data.get("children").concat()
    const box = this.getBox()
    if(box.display === 'flex' && box.flexDirection === 'row') {
      children.sort((a, b) => a.absRect().left - b.absRect().left)
    }
    if(box.display === 'flex' && box.flexDirection === 'column') {
      children.sort((a, b) => a.absRect().top - b.absRect().top)
    }
    return children
  }

  getReceiving() {
    return this.receiving
  }

  isContainer(): boolean {
    return this.getBox().container
  }

  isDraggable() {
    const name = this.getName()
    return this.getBox().movable && name !== 'root' && name !== 'page'
  }

  isResizable() {
    const name = this.getName()
    return this.getBox().resizable && name !== 'root' && name !== 'page'
  }



  getRect(): Rect {
    if (!this.mountPoint) {
      return Rect.ZERO
      // return this.getBox().toRect()
    }
    return this.mountPoint?.getRect()
  }

  updateFromMount(){
    const rect = this.getRect()
    const box = this.getBox()
    box.left.set(rect.left)
    box.top.set(rect.top)
  }


  getStyleObject(){
    return this.data.get("style").toJS()
  }

  getEditMode(): boolean {
    return this.data.get("editMode")
  }

  getPassProps(): ImmutableMap<string, any> {
    return this.data.get("passProps")
  }

  public getValueByPath(path: Array<string>) {
    return this.data.getIn(path)
  }

  public isFlex() {
    return this.getBox().display === 'flex'
  }
  // #endregion

  //#region 计算
  absRect(): Rect {
    const rect = this.getRect()
    const [x, y] = this.absPosition()
    return new Rect(x, y, rect.width, rect.height)
  }

  absPosition(): Array<number> {
    if(this.mountPoint) {
      return this.mountPoint.getAbsPosition()
    }
    
    const parent = this.getParent()
    const rect = this.getRect()
    if (!parent) {
      return [rect.left, rect.top]
    }

    const [x, y] = parent.absPosition()
    return [x + rect.left, y + rect.top]
  }

  absContains(node: Node): boolean {
    const [x, y] = this.absPosition()
    const [x1, y1] = node.absPosition()

    const intersect = Rect.of(
      x,
      y,
      this.getRect().width,
      this.getRect().height
    ).intersect(
      Rect.of(
        x1,
        y1,
        node.getRect().width,
        node.getRect().height
      )
    )

    if (intersect === null) {
      return false
    }
    return intersect.area() / node.getRect().area() >= 0.8
  }

  isAncestorOf(node: Node): boolean {
    while (node.getParent() && node.getParent() !== this) {
      node = node.getParent()
    }
    return node.getParent() === this
  }

  *bfs(): Generator<Node> {
    const queue: Array<Node> = [this]

    let limit = 1000
    while (queue.length > 0 && limit-- > 0) {
      const node = queue.shift()
      if (!node) {
        continue
      }
      yield node

      for (let child of node.getChildren()) {
        queue.push(child)
      }
    }
    if (limit === -1) {
      throw new Error("limit exceeded.")
    }
  }

  bound(x: number, y: number): boolean {
    if (!this.getParent()) {
      return true
    }
    return this.getRect().bound(x, y)
  }

  setParent (node: Node | null){
    this.logger.debug(
      "set-parent",
      this.getType(),
      node?.getType()
    )
    if (node !== null) this.level = node.level + 1
    this.setInstanceData('parent', node)
  }

  public setXYByVec(vec : [number, number]){
    const parent = this.getParent()
    const rect = parent.getRect()

    const box = this.getBox()
    const x = box.left.toNumber()
    const y = box.top.toNumber()
    return this.setXY(x + vec[0], y + vec[1])
  }

  public getXYByVec(vec : [number, number]) : [number, number]{
    const parent = this.getParent()
    const rect = parent.getRect()

    const box = this.getBox()
    const x = box.left.toNumber()
    const y = box.top.toNumber()
    return [x + vec[0], y + vec[1]]
  }


  setMoving = (isMoving: boolean) => {
    this.setInstanceData('isMoving', isMoving)
  }

  public addToRelative(node : Node, position? : [number, number]){
    if(!position) {
      position = [node.getBox().left.toNumber(), node.getBox().top.toNumber()]
    }

    this.add(node)
    node.setXY(...position)
    this.sortChildren(node)
  }

  public addToAbsolute(node : Node, position? : [number, number]) {
    if(!position) {
      position = [node.getBox().left.toNumber(), node.getBox().top.toNumber()]
    }
    this.add(node)
    const [x, y] = position 
    const [sx, sy] = this.absPosition()
    node.setXY(x - sx, y - sy)
    this.sortChildren(node)
  }

  private sortChildren(node : Node){
    this.updateInstanceData(
      "children",
      (_children) => {
        let children = _children as Array<Node>
        children = children.concat(node)
        if (this.isFlex()) {
          children = children.sort(
            (a, b) => {
              return a.getRect().left - b.getRect().left
            }
          )
        }
        return children
      }
    )
  }

  private add = (node: Node) => {

    if(node ===  this) {
      throw new Error("cannot add node to itself.")
    }

    if (node.getParent() === this) {
      return
    }

    this.logger.debug(
      "add",
      node.getName(),
      "to",
      this.getName(),
    )


    if (node.getParent()) {
      const p = node.getParent()
      p.remove(node)
    }

    node.setParent(this)


  }

  public memory(data : any) {
    this.tmpData = data
    this.emit(Topic.MemorizedDataChanged)
  }

  public getMemorizedData() : any{
    if(typeof this.tmpData !== 'undefined') {
      return this.tmpData
    }

    if(this.getParent()) {
      return this.getParent().getMemorizedData()
    }

    return null


  }

  public setChildren (children: Array<Node>) {
    this.setInstanceData('children', children)
  }

  public clearChildren() {
    this.setInstanceData('children', [])
  }



  public remove (node: Node) {
    this.updateInstanceData(
      "children",
      (children: Array<Node>) => {
        return children.filter((x) => x !== node)
      }
    )
  }

  public destroy() {
    if(this.getName() === 'root' || this.getName() === 'page') {
      return
    }

    const parent = this.getParent()
    parent.remove(this)
  }


  public setpassProps = (passObject: any) => {
    this.setInstanceData(
      "passProps",
      fromJS(passObject)
    )
  }

  public setPassPropValue(path: Array<string>, value : any) {
    const passProps = this.getPassProps()
      .setIn(path, value)
    this.setInstanceData("passProps", passProps)
  }

  public setAllowDrag = (allowDrag: boolean) => {
    this.setInstanceData("allowDrag", allowDrag)
  }


  /**
   * 
   * ///TODO: 结合历史部分重构
   * @param data 
   */
  public updateData = (data: NodeData) => {
    this.data = data
    this.emit(Topic.NodePropUpdated)
  }

  public autoResize() {
    const rect = this.getRect()
    this.setWH(rect.width, rect.height)
  }


  setReceiving(node: Node | null) {
    this.logger.debug('set-receiving', node?.getType())
    if (this.receiving !== node) {
      this.receiving = node
      this.emit(Topic.NodePropUpdated)
    }
  }


  //#endregion

  public getRemoteCache(key :string) {
    return this.remoteCache?.get(key)
  }

  public setRemoteCache(key :string, value : any) {
    if(!this.remoteCache) {
      this.remoteCache = new Map()
    }
    this.remoteCache.set(key, value)
  }
  // //#endregion

  findByName(name: string) {
    const result = [...this.bfs()].filter(x => x.getName() === name)
    if(result.length === 1) {
      return result[0]
    }
    return result
  }

  print() {
    const padding = "".padStart(this.level * 2, "  ")
    console.log(padding + this.getType())
    for (let node of this.getChildren()) {
      node.print()
    }
  }

  toJSON(links = {}){
    const data = this.getData().remove('parent')
		const json : Partial<NodeInstanceJsonStructure> = data.toJS()
		const newJson : any = {...json, box : json.box!.toJson()} 
		newJson.children = this.getChildren().map(child => child.toJSON(links))
		return newJson as JsonNode 
  }

  
}
