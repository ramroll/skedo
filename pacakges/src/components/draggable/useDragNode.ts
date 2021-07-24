import DragNode from "./DragNode";
import { DragEvents, RawDragEvents } from "./draggable.types";
import { useEffect, useMemo, useState } from "react";


// <Draggable onDragStart... />
export function useDragNode(props : DragEvents, initialPosition : [number, number]) : [DragNode, RawDragEvents] {
	const node = useMemo<DragNode>(() => new DragNode(), [])
	const [ver, setVer] = useState(0)

	useEffect(() => {
		node.init()
		setVer(x => x + 1)
	}, initialPosition)

	const handlers : RawDragEvents= {
		onDragstart: (e: DragEvent) => {
      node.start(e)
      props.onDragStart && props.onDragStart(node)
    },
    onDrag: (e: DragEvent) => {
      node.update(e)
			setVer(x => x + 1)
      props.onDrag && props.onDrag(node)
    },
    onDragend: (e: DragEvent) => {
      node.update(e)
      props.onDragEnd && props.onDragEnd(node)
    },
	}
	return [node,handlers]
}