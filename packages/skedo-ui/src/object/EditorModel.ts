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
import { NodeSelector } from './NodeSelector'

export enum UIStates{
  Start,
  StartAdd,
  Adding,
  Added,
  Selected
}

export enum UIEvents {
  AUTO,
  EvtStartDragAdd,
  EvtAddDraging,
  EvtDrop,

}


export class EditorModel extends StateMachine<UIStates, UIEvents> {

  ctrlDown : boolean 
  altDown : boolean
  mouseDown : boolean
  root : Node
  startSelVer : number 
  selection : Selection
  resizer : Resizer
  propertyEditor : PropertyEditor
  page : Page
  dropCompoentMeta : ComponentMeta | null = null
  dropComponentPosition : [number, number] = [0, 0]
  dropNode?: Node | null
  logger : Logger
  copyList : Array<Node> = []
  cord : Cord

  constructor(json : NodeJsonStructure, pageName : string){
    super(UIStates.Start)
    this.selection = new Selection(this)
    this.resizer = new Resizer()

    this.propertyEditor = new PropertyEditor(this)
    this.page = new Page(pageName, this, json)
    this.root = this.page.root
    this.ctrlDown = false
    this.mouseDown = false
    this.altDown = false
    this.startSelVer = 0
    this.logger = new Logger("editor-model")
    this.cord = new Cord(this.page.root.getRect())

    this.register(UIStates.Start, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
      this.dropCompoentMeta = meta
    })

    this.register(UIStates.Selected, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
      this.dropCompoentMeta = meta
    })

    this.register([UIStates.StartAdd, UIStates.Adding], UIStates.Adding, UIEvents.EvtAddDraging, (position) => {
      this.dropComponentPosition = position
    })
   
    
    this.register([UIStates.StartAdd, UIStates.Adding], UIStates.Added, UIEvents.EvtDrop, () => {
      const position = this.dropComponentPosition
      const node = this.page.createFromMetaNew(this.dropCompoentMeta!, position)
      const receiver = NodeSelector.select(this.root, position, null)
      receiver?.add(node)
      receiver?.emit(Topic.NewNodeAdded)
      this.dropCompoentMeta = null
    })
    
    this.register(UIStates.Added, UIStates.Selected, UIEvents.AUTO, () => {
    })



    // For debug 
    // @ts-ignore
    window.editor = this
  }

  // startCreateByDrag = () => {
  //   if(!this.dropCompoentMeta) {
  //     return UIStates.Start
  //   }

  //   return UIStates.DragInsertStart
  // }

  // dragInsertOver = () => {
  //   if(!this.dropCompoentMeta) {
  //     return UIStates.Start
  //   }
  //   if(!this.dropNode) {
  //     const node = this.page.createFromMeta(this.dropCompoentMeta)
  //     this.selection.clear()
  //     this.selection.add(node)
  //     this.dropNode = node
  //     this.selection.startDrag()
  //   }


  //   this.selection.move()
  //   return UIStates.DragInsertMoving
  // }

  // addDragLeave = () => {
  //   return UIStates.DragInsertStart
  // }

  // /**
  //  * 拖拽新增组件
  //  */
  // dropAndCreate = () => {
  //   if(!this.dropCompoentMeta) {
  //     this.emit(Topic.DragEnd)
  //     return UIStates.Start
  //   }
  //   this.emit(Topic.DragEnd)
  //   this.dropCompoentMeta = null
  //   this.dropNode = null
  //   this.selection.endDrag()
  //   this.page.history.commit()
  //   return UIStates.Selected
  // }


  // startDrag = () =>{
  //   const node = this.page.nodeByCord(this.cord)

  //   if (node?.getEditMode()) {
  //     this.selection.clear()
  //     return UIStates.Start
  //   }
  //   if(!node) {
  //     return UIStates.Start
  //   }

  //   if(!this.selection.contains(node)) {
  //     this.selection.replace(node)
  //   }

  //   return UIStates.StartDragMove

  // }

  // prepareDragMove = () => {

  //   this.selection.startDrag()
  //   return UIStates.Moving
  // }

  // cancelSelect = () => {
  //   this.selection.clear()
  //   return UIStates.Start
  // }


  // dragMove = () => {
  //   this.selection.move()
  //   return UIStates.Moving
  // }

  // endMove = () => {
  //   this.selection.endDrag()
  //   this.page.history.commit()
  //   return UIStates.Selected
  // }

  // waitSelect = () => {
  //   return UIStates.Selected
  // }

  // waitSelectMore = () => {
    
  //   const node = this.page.nodeByCord(this.cord)
  //   if(!node) {
  //     this.selection.clear()
  //     return UIStates.Start
  //   }
  //   this.selection.add(node)
  //   return UIStates.Selected
  // }

  // startResize = () => {
  //   this.resizer.startResizing(this.cord)
  //   return UIStates.StartResize
  // }
  // resizing = () => {
  //   this.resizer.resizing(this.cord)
  //   return UIStates.Resize
  // }

  // endResizing = () => {
  //   this.resizer.resized()
  //   this.page.history.commit()
  //   return UIStates.Selected
  // }


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

  // onDragStart(meta : ComponentMeta) {
  //   this.dropCompoentMeta = meta 
  //   this.next(UIEvents.DragStart)
  // }

  // onDragOver(x :number, y : number){
  //   if(this.dropCompoentMeta) {
  //     if(this.cord.updateClient(x, y)){
  //       this.next(UIEvents.DragOver)
  //     }
  //   }
  // }

  // onDragLeave(){
  //   this.next(UIEvents.DragLeave)
  // }

  // onDragDrop(){
  //   this.next(UIEvents.DragEnd)
  // }

  // onMouseDown = (e : ReactMouseEvent) => {
  //   e.preventDefault()
  //   this.saveMovePosition(e)
  //   this.startX = this.cord.clientX
  //   this.startY = this.cord.clientY
  //   this.startSelVer = this.selection.ver

  //   this.mouseDown = true
  //   if(this.ctrlDown) {
  //     this.next(UIEvents.CtrlDown)
  //     return
  //   } 

  //   const target = e.target as Element
  //   const cubeType = target.getAttribute("data-cube")

  //   if (cubeType) {
  //     const nodeId = target.parentElement?.id
  //     const id  = nodeId?.split('-').pop()
  //     if(!id) {
  //       return
  //     }

  //     const node = this.page.nodes[Number.parseInt(id)]
  //     if(node.getType()=== 'page' && cubeType !== '6') {
  //       return
  //     }

  //     this.resizer.setCubeType(Number.parseInt(cubeType))
  //     this.resizer.setNode(node)
  //     this.next(UIEvents.DownWithBar)
  //   } else {

  //     const node = this.page.nodeByCord(this.cord)
  //     if (!node || !node.getParent()) {
  //       this.next(UIEvents.DownWithNothing)
  //     } else {
  //       // 父级元素有Flex状态触发Flex布局
  //       this.next(UIEvents.DownWithNode)
  //     }
  //   }
  // }

  

  // onMouseMove = (e : ReactMouseEvent) => {
  //   if (this.mouseDown) {
  //     if(this.saveMovePosition(e)) {
  //       this.next(UIEvents.Move)
  //     }
  //   }
  // }
  // onMouseUp = (e : MouseEvent) => {
  //   this.mouseDown = false
  //   this.saveMovePosition(e)
  //   this.next(UIEvents.Up)
  // }


  // onClickCapture = (e : ReactMouseEvent) => {
    
  //   const distance = Math.abs(this.cord.clientX - this.startX) + Math.abs(this.cord.clientY - this.startY)
  //   if(this.ctrlDown || this.altDown) {
  //     e.preventDefault()
  //     e.stopPropagation()
  //   }
  //   if(this.selection.ver !== this.startSelVer || distance > 1) {
  //     e.preventDefault()
  //     e.stopPropagation()
  //   }
  // }

  // onScroll = (e : UIEvent<HTMLElement>) => {
  //   const element = e.target as Element
  //   this.cord.updateScroll(element.scrollLeft, element.scrollTop)
  // }


}




export default EditorModel 