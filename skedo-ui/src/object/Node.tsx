import {
  Emiter,
  Rect,
  ComponentMeta,
  Logger,
  PropMeta,
  Topic,
  Node as NodeInterface,
  BoxDescriptor,
  sizeUnitToNumber,
} from "@skedo/core"
import { Map as ImmutableMap, fromJS } from "immutable"
import NodeStyleHelper from "../components/NodeStyleHelper"
import InjectComponent from "../components/InjectComponent"
import ReactDOM from "react-dom"
import MountPoint from "./MountPoint"
import Page from "./Page"

export declare type NodeData = ImmutableMap<string, any>

/**
 * 最核心的一个类
 * 类似VirtualDOM，代表页面上的一个节点
 */
export default class Node
  extends Emiter<Topic>
  implements NodeInterface
{
  meta: ComponentMeta
  logger: Logger
  data: NodeData
  styleHelper: NodeStyleHelper
  mountPoint?: MountPoint
  receiving: Node | null
  level: number = 0
  page? :Page 
  // #region 初始化
  constructor(
    meta: ComponentMeta,
    data : NodeData
  ) {
    super()
    this.logger = new Logger("node")
    this.meta = meta
    this.data = data
    this.receiving = null
    this.styleHelper = new NodeStyleHelper(this)
  }

  //#endregion

  // #region runtime
  mount(ele: HTMLElement) {
    this.mountPoint = new MountPoint(ele, this)
  }
  // #endregion

  // #region 访问器
  getParent(): Node {
    return this.data.get("parent")
  }

  getStyle(key: string): any {
    return this.data.getIn(["style", key])
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

  setParent = (node: Node | null) => {
    this.logger.debug(
      "set-parent",
      this.getType(),
      node?.getType()
    )
    if (node !== null) this.level = node.level + 1
    this.data = this.data.set("parent", node)
  }

  setMoving = (isMoving: boolean) => {
    this.data = this.data.set("isMoving", isMoving)
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
    this.data = this.data.update(
      "children",
      (children: Array<Node>) => {
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


  setChildren = (children: Array<Node>) => {

    this.data = this.data.set("children", children)
  }


  private updateBoxValue(key : string, value : number) {
    return this.data.update('box', box => {
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

  setXY = (x: number, y: number) => {
    this.data = this.updateBoxValue('left', x)
    this.data =  this.updateBoxValue('top', y)
  }

  setXYWH = (x : number, y : number, w : number, h : number) => {
    this.data = this.updateBoxValue('left', x)
    this.data = this.updateBoxValue("width", w)
    this.data = this.updateBoxValue("height", h)
    this.data = this.updateBoxValue("top", y)
  }

  setWH = (w : number, h : number) => {
    this.data = this.updateBoxValue("width", w)
    this.data = this.updateBoxValue("height",h)
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

  float = () => {
    this.logger.log("float", this.getParent() === null)
    const [x, y] = this.absPosition()
    const parent = this.getParent()
    if (parent) {
      parent.remove(this)
    }
    this.setParent(null)
    this.setXY(x, y)
    parent?.emit(Topic.Updated)
  }

  remove = (node: Node) => {
    this.data = this.data.update(
      "children",
      (children: Array<Node>) => {
        return children.filter((x) => x !== node)
      }
    )
  }


  setpassProps = (passObject: any) => {
    this.data = this.data.set(
      "passProps",
      fromJS(passObject)
    )
  }

  setAllowDrag = (allowDrag: boolean) => {
    this.data = this.data.set("allowDrag", allowDrag)
  }

  setEditMode = (mode: boolean) => {
    this.data = this.data.set("editMode", mode)
    this.emit(Topic.EditMode, mode)
  }

  updateData = (data: NodeData) => {
    this.data = data
    this.emit(Topic.Updated)
  }

  autoResize() {
    const rect = this.getRect()
    this.setWH(rect.width, rect.height)
  }

  updateByPath = (path: Array<string>, value: any) => {
    this.data = PropMeta.setPropValue(
      path,
      this.data,
      value
    )
    this.emit(Topic.Updated)
  }

  setReceiving(node: Node | null) {
    this.logger.debug('set-receiving', node?.getType())
    if (this.receiving !== node) {
      this.receiving = node
      this.emit(Topic.Updated)
    }
  }

  //#endregion

  // #region  external render
  renderExternal(elem: HTMLElement) {
    if(!this.page) {
      throw new Error("Page must be initialzied before this.")
    }
    const component = <InjectComponent node={this} editor={this.page?.editor} />
    this.logger.log("render external", elem, component)
    ReactDOM.render(component, elem)
  }
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
