import {Rect} from '@skedo/utils'

export default class ResizerNew{ 
  cubeType : number
  x : number = 0
  y : number = 0

  constructor(cubeType : number) {
    this.cubeType = cubeType 
  }

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


  public nextRect(rect : Rect, vec : [number, number]) {

    const type : number = this.cubeType - 1
    const nvec = ResizerNew.resizerData[type][2] as Array<number>

    const [dx, dy] = vec
    const vec4 = [
      nvec[0] * dx,
      nvec[1] * dy,
      nvec[2] * dx,
      nvec[3] * dy,
    ]

    const left = vec4[0] + rect.left
    const top = vec4[1] + rect.top
    const width = vec4[2] + rect.width
    const height = vec4[3] + rect.height

    return new Rect(left, top, width, height)
  }
}