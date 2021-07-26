import { MouseEvent as ReactMouseEvent } from 'react'
import StateMachine from './StateMachine'
import PropertyEditor from './PropertyEditor'
import { AssistLine } from './AssistLine'
import {
  ComponentMeta,
  Logger,
  throttle,
  Topic,
  Node,
  Page,
  NodeJsonStructure,
  Rect,
} from "@skedo/core"
import { NodeSelector } from './NodeSelector'
import SelectionNew from './Selection.new'
import ResizerNew from './Resizer.new'
import PageExporter from './PageExporter'
import { fileRemote, pageRemote, compose } from '@skedo/request'

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

  constructor(json : NodeJsonStructure, pageName : string){
    super(UIStates.Start)
    this.selection = new SelectionNew()

    this.propertyEditor = new PropertyEditor(this)
    this.page = new Page(pageName, json)
    this.root = this.page.root
    this.ctrlDown = false
    this.mouseDown = false
    this.altDown = false
    this.startSelVer = 0
    this.logger = new Logger("editor-model")
    this.assistLine = new AssistLine()

    // @ts-ignore
    // 调试用
    window["ui"] = this

    this.describe("大家好！我是小师叔，这里在处理拖拽新元素的逻辑", (register) => {
      register(UIStates.Start, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
        this.dropCompoentMeta = meta
      })
  
      register(UIStates.Selected, UIStates.StartAdd, UIEvents.EvtStartDragAdd, (meta : ComponentMeta) => {
        this.dropCompoentMeta = meta
      })
  
      register([UIStates.StartAdd, UIStates.Adding], UIStates.Adding, UIEvents.EvtAddDraging, (position) => {
        this.dropComponentPosition = position
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

 
    })

    this.describe("大家好！我是小师叔，这里在处理选中的逻辑", register => {
      this.register([UIStates.Start, UIStates.Selected], UIStates.Selected, UIEvents.EvtSelected, (node : Node) => {
        this.selection.replace(node)
        this.emit(Topic.SelectionChanged)
      })
      this.register(UIStates.Selected, UIStates.Start, UIEvents.EvtCancelSelect, (node : Node) => {
        this.selection.remove(node)
        this.emit(Topic.SelectionChanged)
      })
   
    })


    this.describe("大家好！我是小师叔，这里在处理拖拽的逻辑", (register) => {
      const handlerSyncMoving = throttle((node : Node, vec : [number, number]) => {
        const absRect = node.absRect()
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

  public async save() {
    const exporter = new PageExporter()
    const json = exporter.exportToJSON(this.page.pageNode)
    const text = JSON.stringify(json)
    
    const composedRemoteCall  = compose(fileRemote.post1, pageRemote.put, (data) => {
      return [this.page.name, data]
    })

    const result = await composedRemoteCall("/page", "test.json", "1.0.0", text)
    this.logger.log('save', json)

  }

}




export default EditorModel 