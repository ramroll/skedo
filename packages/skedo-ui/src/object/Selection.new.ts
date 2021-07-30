import {Node} from '@skedo/core'
export default class SelectionNew {

	private sel : Set<Node> = new Set()

	public add(node : Node){
		this.sel.add(node)
	}

	public size(){
		return this.sel.size
	}

	public contains(node : Node) {
		return this.sel.has(node)
	}

	public remove(node : Node) {
		this.sel.delete(node)
	}

	public replace(node : Node) {
		this.sel.clear()
		this.sel.add(node)
	}
	
	public forEach(fn : (node:Node) => void) {
		for(let node of this.sel.values()) {
			fn(node)
		}
	}
}
