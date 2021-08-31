import { Emiter } from '@skedo/utils'

export default class DragNode extends Emiter<number> {
  dragging: boolean = false
  startX: number = 0 
  startY: number = 0
  diffX: number = 0
  diffY: number = 0 

  update(e : MouseEvent) {
    const diffX =  e.clientX - this.startX
    const diffY =  e.clientY - this.startY

    this.diffX = diffX
    this.diffY = diffY
  } 

  init(){
    this.diffX = 0
    this.diffY = 0
  }

  start(e : MouseEvent) {
    this.dragging = true
    this.startX = e.clientX
    this.startY = e.clientY
  }
  
  
}
