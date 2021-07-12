import { Emiter }  from "../Emiter"
import { Rect } from '../Rect'
import { ComponentMeta } from "../meta/ComponentMeta"
import { Logger } from '../Logger'
import { PropMeta } from '../meta/PropMeta'
import { Topic } from "../Topic"
import { BoxDescriptor, sizeUnitToNumber } from "../BoxDescriptor"
import { Map as ImmutableMap, fromJS } from "immutable"
import { MountPoint } from "./MountPoint"
import { Cord } from "./Cord"

export declare type NodeData = ImmutableMap<string, any>

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
    this.emit(Topic.Updated)
  }

  public getData(){
    return this.data
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

  mount(ele: HTMLElement, cord :Cord) {
    this.mountPoint = new MountPoint(ele, this, cord)
  }
  // #endregion

  // #region 访问器
  getParent(): Node {
    return this.data.get("parent")
  }

  getStyle(key: string): any {
    return this.data.getIn(["style", key])
  }

  getReceiving() {
    return this.receiving
  }

  isMoving(): boolean {
    return this.data.get("isMoving")
  }

  getId(): number {
    return this.data.get("id")
  }

  getChildren(): Array<Node> {
    return this.data.get("children").concat()
  }

  isContainer(): boolean {
    return this.data.get("isContainer")
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

  getBox() : BoxDescriptor{
    return this.data.get('box').toJS()
  }

  getType() {
    return this.data.get("type")
  }

  isFlex() {
    return this.getStyle("display") === "flex"
  }

  getStyleObject(){
    return this.data.get("style").toJS()
  }

  getEditMode(): boolean {
    return this.data.get("editMode")
  }

  getPassProps(): any {
    return this.data.get("passProps")
  }

  allowDrag(): boolean {
    return this.data.get("allowDrag")
  }

  getValueByPath(path: Array<string>) {
    return this.data.getIn(path)
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

  setMoving = (isMoving: boolean) => {
    this.setInstanceData('isMoving', isMoving)
  }

  add = (node: Node) => {

    if (node.getParent() === this) {
      return
    }
    this.logger.debug(
      "add",
      node.getType(),
      node.absRect(),
      "to",
      this.getType(),
      this.getRect()
    )
    const [x, y] = node.absPosition()
    const [sx, sy] = this.absPosition()

    node.setXY(x - sx, y - sy)
    if (node.getParent()) {
      const p = node.getParent()
      p.remove(node)
      p.emit(Topic.Updated)
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
    this.emit(Topic.Updated)
  }


  setChildren (children: Array<Node>) {
    this.setInstanceData('children', children)
  }


  private updateBoxValue(key : string, value : number) {
    this.updateInstanceData('box', box => {
      const item = box.get(key)
      if(!item.get) {
        debugger
      }
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

  public setXY = (x: number, y: number) => {
    this.updateBoxValue('left', x)
    this.updateBoxValue('top', y)
  }

  setXYWH = (x : number, y : number, w : number, h : number) => {
    this.updateBoxValue('left', x)
    this.updateBoxValue("width", w)
    this.updateBoxValue("height", h)
    this.updateBoxValue("top", y)
  }

  setWH = (w : number, h : number) => {
    this.updateBoxValue("width", w)
    this.updateBoxValue("height",h)
  }

  static moveA2B = (a: Node, b: Node) => {
    if (b === a.getParent()) {
      return
    }
    const [x, y] = a.absPosition()
    const [sx, sy] = b.absPosition()
    console.debug(
      "[node]",
      "moveA2B",
      `x=${x},y=${y},sx=${sx}, sy=${sy}`
    )
    a.setXY(x - sx, y - sy)
    if (a.getParent()) {
      const p = a.getParent()
      a.getParent().remove(a)
      p.emit(Topic.Updated)
    }
    b.add(a)
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

  public setEditMode = (mode: boolean) => {
    this.setInstanceData("editMode", mode)
    this.emit(Topic.EditMode, mode)
  }

  /**
   * 
   * ///TODO: 结合历史部分重构
   * @param data 
   */
  public updateData = (data: NodeData) => {
    this.data = data
    this.emit(Topic.Updated)
  }

  public autoResize() {
    const rect = this.getRect()
    this.setWH(rect.width, rect.height)
  }


  setReceiving(node: Node | null) {
    this.logger.debug('set-receiving', node?.getType())
    if (this.receiving !== node) {
      this.receiving = node
      this.emit(Topic.Updated)
    }
  }

  //#endregion
  // //#endregion

  findByType(type : string) {
    return [...this.bfs()].filter(x => x.getType() === type)
  }

  print() {
    const padding = "".padStart(this.level * 2, "  ")
    console.log(padding + this.getType())
    for (let node of this.getChildren()) {
      node.print()
    }
  }
}
