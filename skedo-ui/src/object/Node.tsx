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
  NodeJsonStructure,
  boxDescriptor as boxDescriptorFN, 
  BoxDescriptorInput,
} from "@skedo/core"
import Page from "./Page"
import { EditorModel } from "./EditorModel"
import ComponentsLoader from "./ComponentsLoader"
import { Map as ImmutableMap, fromJS } from "immutable"
import NodeStyleHelper from "../components/NodeStyleHelper"
import InjectComponent from "../components/InjectComponent"
import ReactDOM from "react-dom"
import MountPoint from "./MountPoint"

export declare type NodeData = ImmutableMap<string, any>

/**
 * 最核心的一个类
 * 类似VirtualDOM，代表页面上的一个节点
 */
export default class Node
  extends Emiter<Topic>
  implements NodeInterface
{
  page: Page
  editor: EditorModel
  meta: ComponentMeta
  logger: Logger
  data: NodeData
  styleHelper: NodeStyleHelper
  dummy: boolean
  mountPoint?: MountPoint
  receiving: Node | null
  level: number = 0
  // #region 初始化
  constructor(
    editor: EditorModel,
    boxDescriptor:  BoxDescriptor | null,
    meta: ComponentMeta,
    dummy = false,
    importData : NodeData | null = null
  ) {
    super()

    this.logger = new Logger("node")
    this.meta = meta
    this.dummy = dummy
    this.editor = editor
    this.page = editor.page

    this.data = this.meta.createData(
      this.page.addNode(this),
      boxDescriptor,
      importData
    )

    // this.data = this.loadValuesFromProps(this.data)
    // 需要先从属性编辑器的属性配置中导入默认属性
    // 然后再读取配置中style选项
    if(!importData) { 
      this.data = this.data.update(
        "style",
        (style: ImmutableMap<string, any>) => {
          const metaStyle = fromJS(meta.style) as ImmutableMap<string,any>
          return style.merge(metaStyle)
        }
      )
    }
    this.receiving = null
    this.styleHelper = new NodeStyleHelper(this)
    this.initMutations()
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

  root(): Node {
    return this.page.root
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

  select(
    x: number,
    y: number,
    altDown: boolean = false
  ): Node | null {
    let node = this.__select(x, y)

    const parent = node?.getParent()
    if (!altDown && parent && parent.isFlex()) {
      node = parent
    }

    this.logger.log("select node", node?.getType(), altDown)

    return node
  }

  __select(x: number, y: number, depth = 0): Node | null {
    if (depth > 10) {
      throw new Error("depth overflow")
    }

    const children = this.getChildren()
    if (this.bound(x, y)) {
      if (
        !children.find((node) =>
          node.bound(
            x - this.getRect().left,
            y - this.getRect().top
          )
        )
      ) {
        return this
      }
    }

    for (let child of children) {
      const result = child.__select(
        x - this.getRect().left,
        y - this.getRect().top,
        depth + 1
      )

      if (result != null) {
        return result
      }
    }
    return null
  }

  copy() {
    const rect = this.getRect()
    const node = new Node(
      this.editor,
      boxDescriptorFN({
        left : rect.left,
        top : rect.top,
        width : rect.width,
        height : rect.height,
        mode : this.getBox().mode
      }),
      this.meta,
      true
    )
    this.getChildren().forEach((child) => {
      node.add(child.copy())
    })
    return node
  }

  //#endregion

  // #region mutations
  initMutations() {
    const transactionWrapper = (
      fn: (...arg: Array<any>) => any,
      name: string
    ) => {
      return (...args: Array<any>) => {
        const a = this.data
        const result = fn(...args)
        const b = this.data

        if (!this.dummy) {
          this.page.history.record({
            from: a,
            to: b,
            name,
            node: this,
          })
        }
        return result
      }
    }

    this.setParent = transactionWrapper(
      this.setParent,
      "set-parent"
    )
    this.add = transactionWrapper(this.add, "add-node")
    this.addFromJSON = transactionWrapper(
      this.addFromJSON,
      "add-from-json"
    )
    this.setChildren = transactionWrapper(
      this.setChildren,
      "set-children"
    )
    this.setXY = transactionWrapper(this.setXY, "set-xy")
    this.setXYWH = transactionWrapper(this.setXYWH, "set-xywh")
    this.float = transactionWrapper(this.float, "float")
    this.remove = transactionWrapper(this.remove, "remove")
    this.setpassProps = transactionWrapper(
      this.setpassProps,
      "set-passprops"
    )
    this.updateByPath = transactionWrapper(
      this.updateByPath,
      "update-by-path"
    )
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

  addFromJSON = (json: NodeJsonStructure) => {
    if(typeof json.box.width !== 'object') {
      json.box = boxDescriptorFN(json.box as BoxDescriptorInput)
    }
    const child = Node.fromJson(json, this.editor)
    this.add(child)
    this.emit(Topic.Updated)
    return child
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

  setDummy(dummy: boolean) {
    this.dummy = dummy
  }

  setReceiving(node: Node | null) {
    this.logger.debug('set-receiving', node?.getType())
    if (this.receiving !== node) {
      this.receiving = node
      this.emit(Topic.Updated)
    }
  }

  //#endregion

  // #region 静态区
  static findDropTarget(root: Node, node: Node) {
    const absRect = node.absRect()

    console.debug(
      "[node]",
      "find-drop-target",
      node.getType(),
      absRect
    )

    // p是node插入后的父元素
    const rect = node.getRect()
    let p = root.select(
      absRect.left + rect.width / 2,
      absRect.top + rect.height / 2
    )

    console.debug(
      "[node]",
      "find-drop-target>",
      p ? p.getType() : null
    )
    // 递归找到能够承载p的最小层级
    while (
      p &&
      (!p.absContains(node) || !p.isContainer())
    ) {
      p = p.getParent()
      console.debug(
        "[node]",
        "find-drop-target>",
        p ? p.getType() : null
      )
    }
    // 最小层级是自己或者自己的父元素
    if (p === node || p === node.getParent()) {
      console.debug(
        "[node]",
        "find-drop-target-result",
        null,
        p ? p.getType() : "null",
        node.getType(),
        node.getParent()
      )
      return null
    }

    console.debug("[node]", "find-drop-target-result", p)
    return p
  }

  static fromJson(
    json: NodeJsonStructure,
    editor: EditorModel
  ): Node {
    if(typeof json.box.width !== 'object') {
      json.box = boxDescriptorFN(json.box as BoxDescriptorInput)
    }
    const meta = ComponentsLoader.loadByType(
      json.group,
      json.type
    )
    
    const instanceData = json.id ? 
      fromJS(json) : null
    const node = new Node(editor, json.box as BoxDescriptor, meta, false, instanceData as (NodeData | null))
    if (json.passProps) {
      node.setpassProps(json.passProps)
    }
    

    if(!json.id) {
      json.children &&
        json.children.forEach((child) => {
          node.add(Node.fromJson(child, editor))
        })
    } else {
      json.children &&
        node.setChildren(json.children.map(child => {
          const childNode = Node.fromJson(child, editor)
          childNode.setParent(node)
          return childNode
        }))
    }
    return node
  }

  //#endregion

  // #region  external render
  renderExternal(elem: HTMLElement) {
    const component = <InjectComponent node={this} />
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
