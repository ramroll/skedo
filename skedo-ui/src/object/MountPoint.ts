import { Rect } from '@skedo/core'
import Node from './Node'

class MountPoint {
	ele : HTMLElement
	node : Node

	constructor(ele : HTMLElement, node : Node) {
		this.ele = ele
		this.node = node
	}

	findParentNode() {
		let p = this.ele.parentElement
		while(p && !p.hasAttribute("data-skedo-node")) {
			p = p.parentElement
		}
		if(p === null) {
			return null
		}
		const id = Number.parseInt(p.getAttribute("id")?.split("-").pop() || '')
		return this.node.page?.nodes[id]
	}

	getRect() : Rect{
		const rect = this.ele.getBoundingClientRect()
		const parent = this.node.getParent()
		if(parent && parent.mountPoint) {
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
		const cord = this.node.page?.editor.cord
		if(!cord) {
			throw new Error("Page is not initialized to node.")
		}
		const left = Math.round(rect.left + cord.scrollX - cord.viewport.left)
		const top = Math.round(rect.top+ cord.scrollY - cord.viewport.top)
		return [left, top]
	}

	positionDiff(node : Node){
		const rect1 = this.ele.getBoundingClientRect()
		const rect2 = node.mountPoint?.ele.getBoundingClientRect()
		if(!rect2) {
			throw new Error("You cannot call positiondiff on unmounted node.")
		}

		return [rect1.left - rect2.left, rect1.top - rect2.top]

	}

}

export default MountPoint