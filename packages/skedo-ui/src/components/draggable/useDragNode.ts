import DragNode from "./DragNode";
import { DragEvents } from "./draggable.types";
import { useEffect, useMemo, useState } from "react";


// <Draggable onDragStart... />
export function useDragNode(props : DragEvents ) : [DragNode, any] {
	const node = useMemo<DragNode>(() => new DragNode(), [])
	const [ver, setVer] = useState(0)

  useEffect(() => {
    if(node.dragging) {
      props.onDrag && props.onDrag(node)
    }
  }, [ver])

	const handlers= {
		onMouseDown : (e: MouseEvent) => {
      node.start(e)
      props.onDragStart && props.onDragStart(node)
    },
    onMouseMove : (e: MouseEvent) => {
			if (node.dragging) {
        node.update(e)
        setVer((x) => x + 1)
      }
    },
    onMouseUp : (e: DragEvent) => {
			if (node.dragging) {
        node.update(e)
				node.dragging = false
        props.onDragEnd && props.onDragEnd(node)
        node.init()
      }
    },
	}
	return [node,handlers]
}