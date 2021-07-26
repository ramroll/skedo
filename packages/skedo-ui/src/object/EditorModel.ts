import { MouseEvent as ReactMouseEvent } from 'react'
import StateMachine from './StateMachine'
import PropertyEditor from './PropertyEditor'
import Page from './Page'
import { AssistLine } from './AssistLine'
import {
  ComponentMeta,
  Logger,
  throttle,
  Topic,
  Cord,
  Node,
  NodeJsonStructure,
  Rect,
} from "@skedo/core"
import { NodeSelector } from './NodeSelector'
import SelectionNew from './Selection.new'
import ResizerNew from './Resizer.new'

export enum UIStates{
  Start,
  StartAdd,
  Adding,
  Added,
  Selected,
  Moving,
  Moved,
  StartResize,
  Resizing,
  Resized
}

export enum UIEvents {
  AUTO,
  EvtStartDragAdd,
  EvtAddDraging,
  EvtDrop,
  EvtMoving,
  EvtSelected,
  EvtCancelSelect,
  EvtNodeMoved,
  EvtNodeSyncMoving,
  EvtStartResize

}


export class EditorModel extends StateMachine<UIStates, UIEvents> {

  assistLine : AssistLine
  ctrlDown : boolean 
  altDown : boolean
  mouseDown : boolean
  root : Node
  startSelVer : number 
  selection : SelectionNew 
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
    this.selection = new SelectionNew()

    this.propertyEditor = new PropertyEditor(this)
    this.page = new Page(pageName, this, json)
    this.root = this.page.root
    this.ctrlDown = false
    this.mouseDown = false
    this.altDown = false
    this.startSelVer = 0
    this.logger = new Logger("editor-model")
    this.cord = new Cord(this.page.root.getRect())
    this.assistLine = new AssistLine()

    this.register(UIStates.Start, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
      this.dropCompoentMeta = meta
    })

    this.register(UIStates.Selected, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
      this.dropCompoentMeta = meta
    })

    this.register([UIStates.StartAdd, UIStates.Adding], UIStates.Adding, UIEvents.EvtAddDraging, (position) => {
      this.dropComponentPosition = position
    })

    this.register([UIStates.Start, UIStates.Selected], UIStates.Selected, UIEvents.EvtSelected, (node : Node) => {
      this.selection.replace(node)
      this.emit(Topic.SelectionChanged)
    })

    const handlerSyncMoving = throttle((node : Node, vec : [number, number]) => {
      const absRect = node.absRect()
      // absRect.left += vec[0]
      // absRect.top += vec[0]
      const receiver = NodeSelector.select(this.root, [absRect.left , absRect.top ], node)
      const lines = this.assistLine.calculateLines(absRect, node, receiver!)
      this.emit(Topic.AssistLinesChanged,  {lines : lines, show : true})
    }, 30)

    this.register([UIStates.Selected, UIStates.Moving], UIStates.Moving, UIEvents.EvtNodeSyncMoving, (node : Node, vec : [number, number]) => {
      handlerSyncMoving(node, vec)
    })
    
    this.register([UIStates.Start, UIStates.Selected, UIStates.Moving], UIStates.Moved, UIEvents.EvtNodeMoved, (node : Node, vec : [number, number]) => {
      node.setXYByVec(vec) 
      node.emit(Topic.NodeMoved)
      this.emit(Topic.NodeMoved)
      this.emit(Topic.AssistLinesChanged, {lines : [], show : false})
    })

    this.register(UIStates.Moved, UIStates.Selected, UIEvents.AUTO, () => {
    })

    this.register(UIStates.Selected, UIStates.Start, UIEvents.EvtCancelSelect, (node : Node) => {
      this.selection.remove(node)
      this.emit(Topic.SelectionChanged)
    })


   
   
    
    this.register([UIStates.StartAdd, UIStates.Adding], UIStates.Added, UIEvents.EvtDrop, () => {
      const position = this.dropComponentPosition
      const node = this.page.createFromMetaNew(this.dropCompoentMeta!, position)
      const receiver = NodeSelector.select(this.root, position, null)
      receiver?.add(node)
      receiver?.emit(Topic.NewNodeAdded)
      this.dropCompoentMeta = null
      this.selection.replace(node)
      this.emit(Topic.SelectionChanged)
    })
    
    this.register(UIStates.Added, UIStates.Selected, UIEvents.AUTO, () => {
    })



    this.describe("大家好！我是小师叔！这里是调整大小的交互逻辑", register => {

      let resizeNode : Node | null = null
      let startRect :Rect | null= null
      let resizer : ResizerNew | null = null 
      let vecStart : [number, number] = [0, 0] 
      register(
        [UIStates.Start, UIStates.Selected],
        UIStates.StartResize,
        UIEvents.EvtStartResize,
        (cubeType : number, clientVec : [number, number], node : Node) => {
          resizeNode = node
          resizer = new ResizerNew(cubeType)
          startRect = node.absRect()
          vecStart = clientVec
        } 
      )

      register(
        [UIStates.StartResize, UIStates.Resizing],
        UIStates.Resizing,
        UIEvents.EvtMoving,
        (vecClient) => {
          const vec : [number, number] = [vecClient[0] - vecStart[0], vecClient[1] - vecStart[1]]

          if(resizeNode) {
            const nextRect = resizer!.nextRect(startRect!, vec)

            const parentRect = resizeNode.getParent().getRect()
            console.log(nextRect.top - parentRect.top)

            resizeNode.setXYWH(
              nextRect.left - parentRect.left,
              nextRect.top - parentRect.top,
              nextRect.width,
              nextRect.height
            )

            resizeNode.emit(Topic.Resized)
          }
        } 
      )

      register(
        UIStates.Resizing, UIStates.Resized, UIEvents.EvtDrop,
        () => {
          resizeNode = null
        }
      )

      register(
        UIStates.Resized, UIStates.Selected, UIEvents.AUTO,
        () => {
          this.emit(Topic.Resized)
        }
      )
    })


    // For debug 
    // @ts-ignore
    window.editor = this
  }

  public getStateDesc(){
    return UIStates[this.s]
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


  // onKeyDown = (e : KeyboardEvent) => {

  //   if(this.ctrlDown && e.key === 'z') {
  //       this.logger.debug("keydown ctrl+z")
  //       this.page.history.backward()
  //       return
  //   }

  //   if(e.key === 'F2' && this.selection.nodes().length === 1) {
  //     for(let node of this.selection.nodes()) {
  //       node.setEditMode(true)
  //     }
  //   }

  //   if(e.ctrlKey) {
  //       this.ctrlDown = true
  //   }
  //   if(e.altKey) {
  //       this.altDown = true
  //   }

  // }

  // onKeyUp = (e : KeyboardEvent) => {
  //   if(this.ctrlDown && e.key === 'c') {
  //     this.copyList = this.selection.nodes()
  //     return  
  //   }
  //   else if(this.ctrlDown && e.key === 'v') {
  //     for(let node of this.copyList) {
  //       const copyNode = this.page.copy(node)
  //       node.getParent().add(copyNode)
  //       node.getParent().emit(Topic.Updated)
  //     }
  //     return  
  //   }
  //   else if(e.key === 'Delete') {
  //     this.selection.nodes().forEach(item => {
  //       item.getParent().remove(item)
  //       item.getParent().emit(Topic.Updated)
  //     })
  //     this.selection.clear()

  //   }
  //   if(this.ctrlDown)
  //     this.ctrlDown = false
  //   if(this.altDown)
  //     this.altDown = false
  // }

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