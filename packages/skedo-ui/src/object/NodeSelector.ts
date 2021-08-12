import {Node} from '@skedo/meta'
export class NodeSelector {
	public static selectForDrop(
    container : Node,
		position : [number, number],
		exclude : Node | null
	) {

		let node = NodeSelector.select(container, position, exclude)

		while(node && !node.isContainer()) {
			node = node.getParent()
		}

		if(node?.getParent() === null) {
			node = node.getChildren()[0]
		}
		return node
	}

	private static select(
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