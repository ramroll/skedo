import { Emiter } from './Emiter'

export default class DragNode extends Emiter<number> {
  dragging: boolean = false
  startX: number = 0 
  startY: number = 0
  diffX: number = 0
  diffY: number = 0 


  update(e : DragEvent) {
    const diffX =  e.clientX - this.startX
    const diffY =  e.clientY - this.startY

    this.diffX = diffX
    this.diffY = diffY
  } 

  init(){
    this.diffX = 0
    this.diffY = 0
  }

  start(e : DragEvent) {
    this.startX = e.clientX
    this.startY = e.clientY
  }
  
  
}
