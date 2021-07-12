import { Node } from "./Node";

export class LinkedNode extends Node{

	node : Node
	constructor(id : number, node : Node) {
		const box = node.getBox()
		const data = node.meta.createData(id, box)
		super(node.meta, data)
		this.node = node
	}

	getChildren() {
		return this.node.getChildren()
	}

	setChildren (list : Array<Node>) {
		this.node.setChildren(list)
	}

	setParent(parent : Node | null) {
		this.node.setParent(parent)
	}

	getParent(){
		return this.node.getParent()
	}
}