import {Rect} from "@skedo/core"

export default class Cord {

	clientX : number
	clientY : number
	viewport :Rect
	stage : Rect
	scrollX : number
	scrollY : number
	constructor(stage : Rect){
		this.clientX = 0 
		this.clientY = 0 
		this.scrollX =  0 
		this.scrollY = 120
		this.viewport = Rect.ZERO
		this.stage = stage 
	}

	worldX() : number {
		return Math.round(this.clientX + this.scrollX - this.viewport.left)
	}
	worldY() : number {
		return Math.round(this.clientY + this.scrollY - this.viewport.top)
	}

	updateClient(clientX : number, clientY : number) {
		const roundX = Math.round(clientX)
		const roundY = Math.round(clientY)
		if(roundX !== this.clientX || roundY !== this.clientY) {
			this.clientX = Math.round(roundX)
			this.clientY = Math.round(roundY)
			return true
		}
		return false
	}

	updateScroll(scrollX : number, scrollY : number) {
		this.scrollX = Math.round(scrollX)
		this.scrollY = Math.round(scrollY)
	}


	initScroll() {
		this.scrollX = (this.stage.width - this.viewport.width) / 2
		this.scrollY = 0
	}

	setViewPort(rect : Rect) {
		this.viewport = rect
	}

}