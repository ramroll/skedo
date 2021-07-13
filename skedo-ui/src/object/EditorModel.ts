import { MouseEvent as ReactMouseEvent,  UIEvent } from 'react'
import StateMachine from './StateMachine'
import Selection from './Selection'
import Resizer from './Resizer'
import PropertyEditor from './PropertyEditor'
import Page from './Page'
import {
  ComponentMeta,
  Logger,
  throttle,
  Topic,
  Cord,
  Node,
  NodeJsonStructure,
} from "@skedo/core"

enum EditorState{
  Start,
  StartDragMove,
  FlexDrag,
  FlexMoving,
  FlexDrop,
  DragSelect,
  Selected,
  Moving,
  StartResize,
  Resize,
  DragInsertStart,
  DragInsertMoving,
  
  
}

enum DragTrigger {
  DownWithNode,
  DownWithFlex,
  DownWithNothing,
  DownWithBar,
  Up,
  Move,
  CtrlDown,
  AltDown,
  DragStart,
  DragOver,
  DragLeave,
  DragEnd
}


export class EditorModel extends StateMachine<EditorState, DragTrigger> {

  ctrlDown : boolean 
  altDown : boolean
  mouseDown : boolean
  root : Node
  startX : number
  startY : number
  startSelVer : number 
  selection : Selection
  resizer : Resizer
  propertyEditor : PropertyEditor
  page : Page
  dropCompoentMeta : ComponentMeta | null = null
  dropNode?: Node | null
  logger : Logger
  copyList : Array<Node> = []
  cord : Cord

  constructor(json : NodeJsonStructure, pageName : string){
    super(EditorState.Start)
    this.selection = new Selection(this)
    this.resizer = new Resizer()

    this.propertyEditor = new PropertyEditor(this)
    this.page = new Page(pageName, this, json)
    this.root = this.page.root
    this.ctrlDown = false
    this.mouseDown = false
    this.altDown = false
    this.startSelVer = 0
    this.startX = 0
    this.startY = 0
    this.logger = new Logger("editor-model")
    this.cord = new Cord(this.page.root.getRect())


    // drag & move
    this.addRule(EditorState.Start, DragTrigger.DownWithNode, this.startDrag)
    this.addRule(EditorState.StartDragMove, DragTrigger.Move, this.prepareDragMove)
    this.addRule(EditorState.Moving, DragTrigger.Move, this.dragMove)
    this.addRule(EditorState.Moving, DragTrigger.Up, this.endMove)
    this.addRule(EditorState.StartDragMove, DragTrigger.Up, this.endMove)
    
    // select more
    this.addRule(EditorState.Selected, DragTrigger.DownWithNode, this.startDrag)
    this.addRule(EditorState.Selected, DragTrigger.CtrlDown, this.waitSelectMore)
    this.addRule(EditorState.Selected, DragTrigger.Up, this.waitSelect)
    this.addRule(EditorState.Selected, DragTrigger.DownWithNothing, this.cancelSelect)

    // resize 
    this.addRule(EditorState.Selected, DragTrigger.DownWithBar, this.startResize)
    this.addRule(EditorState.StartResize, DragTrigger.Move, this.resizing)
    this.addRule(EditorState.Resize, DragTrigger.Move, this.resizing)
    this.addRule(EditorState.Resize, DragTrigger.Up, this.endResizing)

    // drag insert
    this.addRule(EditorState.Start, DragTrigger.DragStart, this.startCreateByDrag)
    this.addRule(EditorState.Selected, DragTrigger.DragStart, this.startCreateByDrag)
    this.addRule(EditorState.DragInsertStart, DragTrigger.DragOver, this.dragInsertOver)
    this.addRule(EditorState.DragInsertMoving, DragTrigger.DragOver, this.dragInsertOver)
    this.addRule(EditorState.DragInsertMoving, DragTrigger.DragLeave, this.addDragLeave)
    this.addRule(EditorState.DragInsertMoving, DragTrigger.DragEnd, this.dropAndCreate)

    this.dragInsertOver = throttle(this.dragInsertOver,13,EditorState.DragInsertMoving)
    this.logger.debug("constructor")

    this.onMouseMove = throttle(this.onMouseMove, 26)

    // For debug 
    // @ts-ignore
    window.editor = this
  }

  startCreateByDrag = () => {
    if(!this.dropCompoentMeta) {
      return EditorState.Start
    }

    return EditorState.DragInsertStart
  }

  dragInsertOver = () => {
    if(!this.dropCompoentMeta) {
      return EditorState.Start
    }
    if(!this.dropNode) {
      const node = this.page.createFromMeta(this.dropCompoentMeta)
      this.selection.clear()
      this.selection.add(node)
      this.dropNode = node
      this.selection.startDrag()
    }


    this.selection.move()
    return EditorState.DragInsertMoving
  }

  addDragLeave = () => {
    return EditorState.DragInsertStart
  }

  /**
   * 拖拽新增组件
   */
  dropAndCreate = () => {
    if(!this.dropCompoentMeta) {
      this.emit(Topic.DragEnd)
      return EditorState.Start
    }
    this.emit(Topic.DragEnd)
    this.dropCompoentMeta = null
    this.dropNode = null
    this.selection.endDrag()
    this.page.history.commit()
    return EditorState.Selected
  }


  startDrag = () =>{
    const node = this.page.nodeByCord(this.cord)

    if (node?.getEditMode()) {
      this.selection.clear()
      return EditorState.Start
    }
    if(!node) {
      return EditorState.Start
    }

    if(!this.selection.contains(node)) {
      this.selection.replace(node)
    }

    return EditorState.StartDragMove

  }

  prepareDragMove = () => {

    this.selection.startDrag()
    return EditorState.Moving
  }

  cancelSelect = () => {
    this.selection.clear()
    return EditorState.Start
  }


  dragMove = () => {
    this.selection.move()
    return EditorState.Moving
  }

  endMove = () => {
    this.selection.endDrag()
    this.page.history.commit()
    return EditorState.Selected
  }

  waitSelect = () => {
    return EditorState.Selected
  }

  waitSelectMore = () => {
    
    const node = this.page.nodeByCord(this.cord)
    if(!node) {
      this.selection.clear()
      return EditorState.Start
    }
    this.selection.add(node)
    return EditorState.Selected
  }

  startResize = () => {
    this.resizer.startResizing(this.cord)
    return EditorState.StartResize
  }
  resizing = () => {
    this.resizer.resizing(this.cord)
    return EditorState.Resize
  }

  endResizing = () => {
    this.resizer.resized()
    this.page.history.commit()
    return EditorState.Selected
  }


  onKeyDown = (e : KeyboardEvent) => {

    if(this.ctrlDown && e.key === 'z') {
        this.logger.debug("keydown ctrl+z")
        this.page.history.backward()
        return
    }

    if(e.key === 'F2' && this.selection.nodes().length === 1) {
      for(let node of this.selection.nodes()) {
        node.setEditMode(true)
      }
    }

    if(e.ctrlKey) {
        this.ctrlDown = true
    }
    if(e.altKey) {
        this.altDown = true
    }

  }

  onKeyUp = (e : KeyboardEvent) => {
    if(this.ctrlDown && e.key === 'c') {
      this.copyList = this.selection.nodes()
      return  
    }
    else if(this.ctrlDown && e.key === 'v') {
      for(let node of this.copyList) {
        const copyNode = this.page.copy(node)
        node.getParent().add(copyNode)
        node.getParent().emit(Topic.Updated)
      }
      return  
    }
    else if(e.key === 'Delete') {
      this.selection.nodes().forEach(item => {
        item.getParent().remove(item)
        item.getParent().emit(Topic.Updated)
      })
      this.selection.clear()

    }
    if(this.ctrlDown)
      this.ctrlDown = false
    if(this.altDown)
      this.altDown = false
  }

  saveMovePosition = (e : ReactMouseEvent | MouseEvent) : boolean => {
    return this.cord.updateClient(e.clientX, e.clientY)
  }

  onDragStart(meta : ComponentMeta) {
    this.dropCompoentMeta = meta 
    this.next(DragTrigger.DragStart)
  }

  onDragOver(x :number, y : number){
    if(this.dropCompoentMeta) {
      if(this.cord.updateClient(x, y)){
        this.next(DragTrigger.DragOver)
      }
    }
  }

  onDragLeave(){
    this.next(DragTrigger.DragLeave)
  }

  onDragDrop(){
    this.next(DragTrigger.DragEnd)
  }

  onMouseDown = (e : ReactMouseEvent) => {
    e.preventDefault()
    this.saveMovePosition(e)
    this.startX = this.cord.clientX
    this.startY = this.cord.clientY
    this.startSelVer = this.selection.ver

    this.mouseDown = true
    if(this.ctrlDown) {
      this.next(DragTrigger.CtrlDown)
      return
    } 

    const target = e.target as Element
    const cubeType = target.getAttribute("data-cube")

    if (cubeType) {
      const nodeId = target.parentElement?.id
      const id  = nodeId?.split('-').pop()
      if(!id) {
        return
      }

      const node = this.page.nodes[Number.parseInt(id)]
      if(node.getType()=== 'page' && cubeType !== '6') {
        return
      }

      this.resizer.setCubeType(Number.parseInt(cubeType))
      this.resizer.setNode(node)
      this.next(DragTrigger.DownWithBar)
    } else {

      const node = this.page.nodeByCord(this.cord)
      if (!node || !node.getParent()) {
        this.next(DragTrigger.DownWithNothing)
      } else {
        // 父级元素有Flex状态触发Flex布局
        this.next(DragTrigger.DownWithNode)
      }
    }
  }

  

  onMouseMove = (e : ReactMouseEvent) => {
    if (this.mouseDown) {
      if(this.saveMovePosition(e)) {
        this.next(DragTrigger.Move)
      }
    }
  }
  onMouseUp = (e : MouseEvent) => {
    this.mouseDown = false
    this.saveMovePosition(e)
    this.next(DragTrigger.Up)
  }


  onClickCapture = (e : ReactMouseEvent) => {
    
    const distance = Math.abs(this.cord.clientX - this.startX) + Math.abs(this.cord.clientY - this.startY)
    if(this.ctrlDown || this.altDown) {
      e.preventDefault()
      e.stopPropagation()
    }
    if(this.selection.ver !== this.startSelVer || distance > 1) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  onScroll = (e : UIEvent<HTMLElement>) => {
    const element = e.target as Element
    this.cord.updateScroll(element.scrollLeft, element.scrollTop)
  }


}




export default EditorModel 