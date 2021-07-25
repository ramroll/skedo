import {Emiter, Topic, Rect, Cord, NodeType as Node} from '@skedo/core'

export default class ResizerNew extends Emiter<Topic> {

  cubeType? : number
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

  startResizing(node : Node, worldX : number, worldY : number) {
    this.cache = node.getRect()
    this.x = worldX 
    this.y = worldY 
  }


  resizing(node : Node, worldX : number, worldY : number) {
    if(!this.cubeType){return}
    if(!this.cache) {return}

    const dx = worldX - this.x
    const dy = worldY - this.y
    const type : number = this.cubeType
    const nvec = ResizerNew.resizerData[type-1][2] as Array<number>

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

    
    node.setXYWH(left, top, width, height)
  }
}