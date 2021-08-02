import { Rect } from "@skedo/utils"

export class CordNew {

	viewport :Rect
	stage : Rect
	scrollX : number
	scrollY : number
	constructor(stage : Rect){
		this.scrollX =  0 
		this.scrollY = 0 
		this.viewport = Rect.ZERO
		this.stage = stage 
	}

	worldX(clientX : number) : number {
		return Math.round(clientX + this.scrollX - this.viewport.left)
	}
	worldY(clientY : number) : number {
		return Math.round(clientY + this.scrollY - this.viewport.top)
	}


	updateScroll(scrollX : number, scrollY : number) {
		this.scrollX = Math.round(scrollX)
		this.scrollY = Math.round(scrollY)
	}


	setViewPort(rect : Rect) {
		this.viewport = rect
	}

}