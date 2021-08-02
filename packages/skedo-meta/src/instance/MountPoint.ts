import { Node } from './Node'
import { Rect } from '@skedo/utils'
import { CordNew } from './Cord.new'

export class MountPoint {
	ele : HTMLElement
	node : Node
	cord : CordNew

	constructor(ele : HTMLElement, node : Node, cord : CordNew) {
		this.ele = ele
		this.cord = cord
		this.node = node
	}

	getRect() : Rect{
		const rect = this.ele.getBoundingClientRect()
		const parent = this.node.getParent()
		if(parent && parent.getMountPoint()) {
			const [x, y] = this.positionDiff(parent)
			return new Rect(
				Math.round(x),
				Math.round(y),
				Math.round(rect.width),
				Math.round(rect.height),
			)
		}
		return new Rect(
			Math.round(0),
			Math.round(0),
			Math.round(rect.width),
			Math.round(rect.height),
		)
		

	}

	getAbsPosition() : Array<number>  {
		const rect = this.ele.getBoundingClientRect()
		const cord = this.cord
		if(!cord) {
			throw new Error(`Page is not initialized to node ${this.node.getId()}.`)
		}
		const left = Math.round(rect.left + cord.scrollX - cord.viewport.left)
		const top = Math.round(rect.top+ cord.scrollY - cord.viewport.top)
		return [left, top]
	}

	positionDiff(node : Node){
		const rect1 = this.ele.getBoundingClientRect()

		const parentEle = node.getMountPoint()!.ele
		const rect2 = parentEle.getBoundingClientRect()
		if(!rect2) {
			throw new Error("You cannot call positiondiff on unmounted node.")
		}

		const childRect = parentEle.children[0].getBoundingClientRect()

		const dx = childRect.left - rect2.left
		const dy = childRect.top - rect2.top


		return [rect1.left - rect2.left - dx, rect1.top - rect2.top - dy]

	}

}
