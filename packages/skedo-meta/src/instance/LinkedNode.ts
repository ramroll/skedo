import { Node } from "./Node";

/**
 * 特别的一种节点，和Node共享parent和Children,但是拥有自己的盒子
 * 用途：实现列表等大量节点共享的相同配置的组件
 */
export class LinkedNode extends Node{

	node : Node
	constructor(id : number, node : Node) {
		const box = node.getBox()
		const data = node.meta.createData(id, box)
		super(node.meta, data)
		this.node = node
	}

  public setInstanceData(key : string, value : any) : void {
		if(['children', 'parent'].indexOf(key) !== -1) {
			return this.node.setInstanceData(key, value)
		}
		return this.setInstanceData(key, value)
  }
  
  public updateInstanceData(key : string, updator : (value : any) => any) : void  {
		if(['children', 'parent'].indexOf(key) !== -1) {
			return this.node.updateInstanceData(key, updator)
		}
		return this.updateInstanceData(key, updator)
  }

  public updateInstanceByPath(path: Array<string>, value: any) : void{

		if(['children', 'parent'].indexOf(path[0]) !== -1) {
			return this.node.updateInstanceByPath(path, value)
		}
		return this.updateInstanceByPath(path, value)
  }
}