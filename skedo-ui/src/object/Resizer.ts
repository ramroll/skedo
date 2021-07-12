import Cord from '../../../skedo-core/src/instance/Cord'
import {Emiter, Topic, Rect} from '@skedo/core'
import Node from './Node'

export default class Resizer extends Emiter<Topic> {

  cubeType? : number
  node? : Node
  x : number = 0
  y : number = 0
  cache? : Rect 

  static resizerData = [
    ["topleft", 1, [1, 1, -1, -1]],
    ["topmiddle", 2, [0, 1, 0, -1]],
    ["topright", 3, [0, 1, 1, -1]],
    ["middleright", 4, [0, 0, 1, 0]],
    ["bottomright", 5, [0, 0, 1, 1]],
    ["bottommiddle", 6, [0, 0, 0, 1]],
    ["bottomleft", 7, [1, 0, -1, 1]],
    ["middleleft", 8, [1, 0, -1, 0]],
  ]

  setCubeType(type : number) {
    this.cubeType = type
  }

  setNode(node : Node) {
    this.node = node
  }

  startResizing(cord : Cord) {
    this.cache = this.node?.getRect()
    this.x = cord.worldX() 
    this.y = cord.worldY() 
  }


  resizing(cord : Cord) {
    const x = cord.worldX()
    const y = cord.worldY()
    if(!this.cubeType){return}
    if(!this.cache) {return}
    if(!this.node) {return}

    const dx = x - this.x
    const dy = y - this.y
    const type : number = this.cubeType
    const nvec = Resizer.resizerData[type-1][2] as Array<number>

    const vec4 = [
      nvec[0] * dx,
      nvec[1] * dy,
      nvec[2] * dx,
      nvec[3] * dy,
    ]

    const left = vec4[0] + this.cache.left
    const top = vec4[1] + this.cache.top
    const width = vec4[2] + this.cache.width
    const height = vec4[3] + this.cache.height

    
    this.node.setXYWH(left, top, width, height)
    
    this.node?.emit(Topic.Updated)
    this.emit(Topic.Resizing)
  }

  resized() {
    this.emit(Topic.Resized)
  }
}