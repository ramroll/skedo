import Node from "./Node" 
import {Emiter, Logger, Topic} from '@skedo/core'
import { AssistLine } from "./AssistLine"
import EditorModel from "./EditorModel"
import Cord from "../../../skedo-core/src/instance/Cord"
import { History } from "./History"

class SelectedNode{

  startX : number = 0
  startY : number = 0
  receiver : Node | null = null
  node : Node
  logger : Logger = new Logger('selection')

  constructor(node : Node){
    this.node = node
    this.reset()
  }

  reset(){
    const absRect = this.node.absRect()
    this.startX = absRect.left
    this.startY = absRect.top
    this.receiver = null
  }
  
  move = (cord : Cord, root : Node, history : History, dx : number, dy : number) => {
    const receiver = this.selectReceiver(
      cord.worldX(),
      cord.worldY(),
      this.node,
      root
    )
    if(receiver === null) {return}

    if(receiver !== this.receiver) {
      this.logger.debug("receiver changed", receiver.getType())
      receiver.setReceiving(this.node)
      if(this.receiver) {
        this.receiver.setReceiving(null)
      }
      this.receiver = receiver
      return
    }

    this.node.setMoving(true)
    const parent = this.node.getParent()
    if(parent) {
      this.node.setXY(this.startX + dx - parent.getRect().left , this.startY + dy - parent.getRect().top)
    } else {
      this.node.setXY(this.startX + dx , this.startY + dy)
    }
    this.node.emit(Topic.Updated)
    this.receiver.emit(Topic.Updated)
  }

  selectReceiver(x : number, y : number, skip : Node | null, node : Node){
    let p : Node | null | undefined = this.select(x, y, skip, node)
    while(p && !p.isContainer()) {
      p = p?.getParent()
    }
    if(p === node.page?.root && this.node.isFlex()) {
      p = p.page?.pageNode
    }
    return p || null
    
  }

  select(
    x: number,
    y: number,
		skip : Node | null,
    node  : Node,
  ) : (Node | null) {

		if(!node?.bound(x, y) || node === skip) {
			return null
		}

		for(let child of node.getChildren()) {
			const nodeRect = node.getRect()
			const result = this.select(x-nodeRect.left, y-nodeRect.top, skip, child)
			if(result) {
				return result
			}
		}
		return node 
	}

  end(){
    this.node.setMoving(false)
    this.logger.log('end', this.receiver)
    if(this.receiver) {
      this.receiver.add(this.node)
      this.receiver.setReceiving(null)
      this.receiver.emit(Topic.Updated)
      this.receiver = null
    }
    this.node.emit(Topic.ResizeModelUpdated)
  }

}

export default class Selection extends Emiter<Topic> {
  items : Map<Node, SelectedNode>
  startX : number
  startY : number
  assistLine : AssistLine 
  ver : number = 0 
  editor : EditorModel
  logger : Logger = new Logger('selection')
  dragStarted : boolean = false 

  constructor(editor : EditorModel){
    super()
    this.items = new Map()
    this.startX = 0
    this.startY = 0
    this.assistLine = new AssistLine()
    this.editor = editor
  }

  nodes(){
    return [...this.items.keys()]
  }

  clearEditMode(){
    this.nodes().forEach(node => node.setEditMode(false))
  }

  add(node : Node) {
    this.clearEditMode()

    this.items.set(node, new SelectedNode(node))

    const list : Array<Node> = []

    this.nodes().forEach(p => {
      if(node.isAncestorOf(p)) {
        list.push(p)
      }
    })
    
    list.forEach((p) => this.items.delete(p))
    node.emit(Topic.SelectionChanged)
    this.emit(Topic.SelectionChanged)
    this.ver ++
  }

  first() : Node{
    return this.nodes()[0]
  }

  replace(node : Node) {
    this.clear()
    this.add(node)
  }

  contains(node : Node) : boolean {
    const result = !!([...this.items.keys()].find(x => x === node))
    const first = [...this.items.keys()][0]
    return result
  }


  startDrag(){
    this.dragStarted = true
    this.startX = this.editor.cord.worldX() 
    this.startY = this.editor.cord.worldY() 
    if(this.items.size === 1) {
      this.assistLine.start(this.first())
    }
    for(let node of this.nodes() ){
      const defaultContainer =node.isFlex() ? this.editor.page.pageNode : this.editor.root
      defaultContainer.add(node)
    }
    this.items.forEach(item => item.reset())
  }


  move() : void {
    for(let item of this.items.values()) {
      if(!item.node.allowDrag()) {
        continue
      }
      item.move(
        this.editor.cord,
        this.editor.root,
        this.editor.page.history,
        this.editor.cord.worldX() - this.startX,
        this.editor.cord.worldY() - this.startY
      )
    }
    this.emit(Topic.SelectionMoved)
    const item = this.items.values().next().value
    const receiver = (item as SelectedNode).receiver
    if(receiver) {
      this.assistLine.move(receiver)
    }
  }

  endDrag() {
    if(!this.dragStarted) {
      return
    }
    this.dragStarted = false
    if(this.items.size === 1) {
      this.assistLine.endMove()
    }
    for(let item of this.items.values()) {
      item.end()
    }
    this.emit(Topic.SelectionMoved)
    if(this.startX !== this.editor.cord.worldX() || this.startY !== this.editor.cord.worldY()) {
      this.editor.page.history.commit()
    }
  }


  clear(){

    this.clearEditMode()
    const list = this.nodes()
    this.items.clear()
    list.forEach(node => {
      node.emit(Topic.SelectionChanged)
    })
    this.emit(Topic.SelectionChanged)
    this.ver ++
  }


}
