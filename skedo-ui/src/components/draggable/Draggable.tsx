import { useDragNode } from "./useDragNode"
import DragNode from "./DragNode"
import { DragEvents } from "./draggable.types"
import React from "react"
import { mergeDeepLeft } from 'ramda'

type DraggableProps = {
	initialPosition : [number, number],
	children : JSX.Element
} & DragEvents 


const Draggable = (props : DraggableProps) : JSX.Element => {
	const [node, handlers] = useDragNode(props, props.initialPosition)

	const children = props.children

	const childrenProps = children.props
	const addedProps = {
		draggable : true,
		...handlers,
		style : {
			position : 'absolute',
			top : props.initialPosition[1] + 'px',
			left : props.initialPosition[0] + 'px',
			transform : `translate(${node.diffX}px, ${node.diffY}px)`	
		}
	}

	const finalProps = mergeDeepLeft(childrenProps, addedProps) 
	return React.cloneElement(children, finalProps)
}

export default Draggable