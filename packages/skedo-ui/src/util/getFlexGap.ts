
import { Node } from "@skedo/meta";

export function getFlexGap(children: Array<Node>, movingNode: Node, type = 'row') {
	children = children.slice()
	let idx = 0 
	const rect = movingNode.absRect()
	const x = rect.centerX()
	const y = rect.centerY()

	let f = children.find(x => x === movingNode)  ? 1 : 0
	children = children.filter(x => x !== movingNode)
	if(f === 1) {
		children.push(movingNode)
	}

	for (
		let i = 0;
		i < children.length - 1 - f;
		i++
	) {
		const a = children[i].absRect()
		const b = children[i + 1].absRect()

		if (type === "row") {
			if (a.centerX() <= x && b.centerX() > x) {
				idx = i + 1
				break
			}
		} else {
			if (a.centerY() <= y && b.centerY() > y) {
				idx = i + 1
				break
			}
		}
	}

	const lastNode =
    f === 0
      ? children[children.length - 1]
      : children[children.length - 2]
	if (lastNode) {
		if (type === "row") {
			if (lastNode.absRect().centerX() < x) {
				idx = children.length
			}
		} else {
			if (lastNode.absRect().centerY() < y) {
				idx = children.length
			}
		}
	}
	return idx
}