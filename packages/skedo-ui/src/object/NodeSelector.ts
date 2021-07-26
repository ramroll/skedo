import {Node} from '@skedo/core'
export class NodeSelector {
	static select(
    container : Node,
		position : [number, number],
		exclude : Node | null,
  ) : (Node | null) {

		const [x,y] = position
		if(!container?.bound(x, y) || container === exclude) {
			return null
		}

		for(let child of container.getChildren()) {
			const nodeRect = container.getRect()
			const result = NodeSelector.select(child, [x-nodeRect.left, y-nodeRect.top], exclude)
			if(result) {
				return result
			}
		}
		return container 
	}

}