
import { Actions, Meta, States } from '../types/editor.types'
import {Node} from './Node'
import { StateMachine } from './StateMachine'
import { Topics } from './Topics'
export class Editor extends StateMachine<States, Actions, Topics> {

  private root : Node

  constructor(){
    super(States.Start)
    this.root = new Node('root', 0, 0, 800, 800)

    this.describeAddComponent()
    this.describeDrag()
  }

  private describeDrag(){
    let dragNode : Node
    this.register(
      States.Start,
      States.DragStart,
      Actions.EvtDragStart,
      (node : Node) => {
        console.log('node start drag')
        dragNode = node
      }
    )

    this.register(
      States.DragStart,
      States.Stoped,
      Actions.EvtDragEnd,
      (vec: [number, number]) => {
        dragNode!.setXY(vec)
        dragNode!.emit(Topics.NodePositionMoved)
        console.log("node position moved")
      }
    ) 

    this.register(
      States.Stoped,
      States.Start,
      Actions.AUTO,
      () => {
      }
    ) 
    
  }

  private describeAddComponent(){

    let componentToPlace : Meta | null = null
    let addVector : [number, number] = [0, 0]
    this.register(
      States.Start,
      States.PlacingComponent,
      Actions.StartAddComponent,
      (meta) => {
        componentToPlace = meta
      }
    )

    this.register(
      States.PlacingComponent,
      States.PlacingComponent,
      Actions.EvtDrag,
      (vec : [number, number]) => {
        console.log('handle, placing', vec)
        addVector = vec
      }
    )

    this.register(
      States.PlacingComponent,
      States.AddingComponent,
      Actions.EvtDrop,
      () => {
        if(!componentToPlace) {
          throw new Error("no component to create")
        }
        console.log('placing component')
        const node = new Node(
          componentToPlace.type,
          addVector[0] - componentToPlace.w / 2 - 100,
          addVector[1] - componentToPlace.h / 2,
          componentToPlace.w,
          componentToPlace.h,
        )

        console.log(node.printData())
        this.root.add(node)
        this.root.emit(Topics.NodeChildrenUpdated)
      }
    )

    this.register(States.AddingComponent, States.Start, Actions.AUTO, () => {
      console.log("auto reset state")
    })

  }
	public getRoot(){
    return this.root
  }
}