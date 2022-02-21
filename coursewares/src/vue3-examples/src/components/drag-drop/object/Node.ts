import { Emiter } from './Emiter'
import {List, Map} from 'immutable'
export default class Node extends Emiter<number> {

	private nodeData : Map<string,any>

	constructor(type :string, x : number, y : number,w : number,h : number) {
		super()
		this.nodeData = Map({
			type,
			x,
			y,
			w,
			h,
			children : List<Node>()
		})
	}

	public add(child : Node) {
		this.nodeData = this.nodeData.update('children', (children : List<Node>) => {
			return children.push(child)
		})
	}

	public getType() {
		return this.nodeData.get('type')
	}

	public getX(){
		return this.nodeData.get('x')
	}

	public getY(){
		return this.nodeData.get('y')
	}

	public getW(){
		return this.nodeData.get('w')
	}

	public getH() {
		return this.nodeData.get('h')
	}

	public getChildren(){
		return this.nodeData.get('children').toJS()
	}

	public setXYByVector(vec : [number,number]) {
		this.nodeData = this.nodeData.set('x', vec[0] + this.nodeData.get('x'))
			.set('y', vec[1] + this.nodeData.get('y'))
	}
}