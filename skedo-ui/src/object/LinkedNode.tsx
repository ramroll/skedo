import Node from './Node'
export default class LinkedNode {
	node : Node
	passProps : any
	key : any
	id? : number

	constructor(node : Node, passProps : any, key : any){
		this.node = node
		this.passProps = passProps
		this.key = key
		// this.id = this.node.page.id_base++
		// this.node.page.nodes[this.id] = this
	}
}