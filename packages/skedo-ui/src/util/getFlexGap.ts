
import { Node } from "@skedo/meta";
import { Rect } from "@skedo/utils";

export function getFlexGapnew(children : Array<Node>, movingNode : Node, type = 'row') {
	
	function midVal(rect : Rect) {
		if(type === 'row') {
			return rect.centerX()
		}
		return rect.centerY()
	}

	children = children.filter(x => x !== movingNode)

	const values = children.map(x => midVal(x.absRect()))

	const centerVal = midVal(movingNode.absRect())
	values.push(Number.MAX_SAFE_INTEGER)

	return values.findIndex(v => v > centerVal)


}