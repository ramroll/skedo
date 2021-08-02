import { ComponentMeta } from "../meta/ComponentMeta"
import { Logger, Rect, Emiter } from '@skedo/utils'
import { PropMeta } from '../meta/PropMeta'
import { Topic } from "../Topic"
import { BoxDescriptor, NodeData} from "../standard.types"
import { boxDescriptor, sizeUnitToNumber } from "../BoxDescriptor"
import { Map as ImmutableMap, fromJS } from "immutable"
import { MountPoint } from "./MountPoint"
import { Bridge } from "../Bridge"
import { CordNew } from "./Cord.new"

// reactive / hooks
// meta (immutable, data-flow, virtualdom)

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
    return this.data.get('box').toJS()
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
    return [box.width.value, box.height.value]
  }




  public setXY = (x: number, y: number) => {
    this.updateBoxValue('left', x)
    this.updateBoxValue('top', y)
  }

  public setXYWH = (x : number, y : number, w : number, h : number) => {
    this.updateBoxValue('left', x)
    this.updateBoxValue("width", w)
    this.updateBoxValue("height", h)
    this.updateBoxValue("top", y)
  }

  public setWH = (w : number, h : number) => {
    this.updateBoxValue("width", w)
    this.updateBoxValue("height",h)
  }

  protected updateBoxValue(key : string, value : number) {
    this.updateInstanceData('box', box => {
      const item = box.get(key)
      const unit = item.get('unit')
      if(unit === 'px') {
        box = box.setIn([key, 'value'], value)
      }
      else if(unit === '%') {
        const prect = this.getParent().getRect()
        const parentWidth = prect.width
        const parentHeight = prect.height
        if(['marginTop', 'marginBottom', 'top', 'height'].indexOf(key) !== -1) {
          box = box.setIn([key, 'value'], (value / parentHeight))
        } else {
          box = box.setIn([key, 'value'], (value / parentWidth))
        }
      }
      return box
    })
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
  level: number = 0
  // #region 初始化
  constructor(
    meta: ComponentMeta,
    data : NodeData
  ) {
    super(data)
    this.logger = new Logger("node")
    this.meta = meta
    this.receiving = null
  }

  //#endregion

  // #region runtime
  getMountPoint() {
    return this.mountPoint
  }

  mount(ele: HTMLElement, cord :CordNew) {
    this.mountPoint = new MountPoint(ele, this, cord)
  }
  // #endregion

  // #region 访问器

  getChildren(): Array<Node> {
    const containerType = this.getContainerType()
    const children : Array<Node> = this.data.get("children").concat()
    if(containerType === 'flexRow') {
      children.sort((a, b) => a.absRect().left - b.absRect().left)
    }
    else if(containerType === 'flexColumn') {
      children.sort((a, b) => a.absRect().top - b.absRect().top)
    }
    return children
  }
  getReceiving() {
    return this.receiving
  }
  isContainer(): boolean {
    return !!this.meta.containerType
  }

  isDraggable() {
    const name = this.getName()
    return name !== 'root' && name !== 'page'
  }

  getRect(): Rect {
    if (!this.mountPoint) {
      const parent = this.getParent()
      const prect = parent ? parent.getRect() : Rect.ZERO 
      const box = this.getBox() 
      return new Rect(
        Math.round(sizeUnitToNumber('left', box.left, prect.width, prect.height)),
        Math.round(sizeUnitToNumber('top', box.top, prect.width, prect.height)),
        Math.round(sizeUnitToNumber('width', box.width, prect.width, prect.height)),
        Math.round(sizeUnitToNumber('height', box.height, prect.width, prect.height)),
      )
    }
    return this.mountPoint?.getRect()
  }

  updateFromMount(){
    const rect = this.getRect()
    this.updateBoxValue('left', rect.left)
    this.updateBoxValue('top', rect.top)
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
    return this.meta.containerType === 'flexRow'
      || this.meta.containerType === 'flexColumn'
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
    const x = sizeUnitToNumber('left', box.left, rect.width, rect.height)
    const y = sizeUnitToNumber('top', box.top, rect.width, rect.height)
    return this.setXY(x + vec[0], y + vec[1])
  }

  public getXYByVec(vec : [number, number]) : [number, number]{
    const parent = this.getParent()
    const rect = parent.getRect()

    const box = this.getBox()
    const x = sizeUnitToNumber('left', box.left, rect.width, rect.height)
    const y = sizeUnitToNumber('top', box.left, rect.width, rect.height)
    return [x + vec[0], y + vec[1]]
  }


  setMoving = (isMoving: boolean) => {
    this.setInstanceData('isMoving', isMoving)
  }

  add = (node: Node) => {

    if (node.getParent() === this) {
      return
    }
    this.logger.debug(
      "add",
      node.getName(),
      node.absRect(),
      "to",
      this.getName(),
      this.getRect()
    )
    const [x, y] = node.absPosition()
    const [sx, sy] = this.absPosition()

    node.setXY(x - sx, y - sy)
    if (node.getParent()) {
      const p = node.getParent()
      p.remove(node)
    }

    node.setParent(this)

    this.updateInstanceData(
      "children",
      (_children) => {
        let children = _children as Array<Node>
        children = children.concat(node)
        if (this.isFlex()) {
          children = children.sort(
            (a, b) => a.getRect().left - b.getRect().left
          )
        }
        return children
      }
    )
  }


  setChildren (children: Array<Node>) {
    this.setInstanceData('children', children)
  }



  public remove (node: Node) {
    this.updateInstanceData(
      "children",
      (children: Array<Node>) => {
        return children.filter((x) => x !== node)
      }
    )
  }


  public setpassProps = (passObject: any) => {
    this.setInstanceData(
      "passProps",
      fromJS(passObject)
    )
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


  public getContainerType() {
    return this.meta.containerType
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
}
