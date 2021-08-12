import { useDragNode } from "./useDragNode"
import { DragEvents } from "./draggable.types"
import React from "react"
import { mergeDeepLeft } from 'ramda'

type DraggableProps = {
	initialPosition : [string, string],
	children : JSX.Element,
	enabled : boolean,
	style ? : any
} & DragEvents 


const Draggable = (props : DraggableProps) : JSX.Element => {
	const [node, handlers] = useDragNode(props)


	const children = props.children
	const childrenProps = children.props

	const style : any = {
		position : 'absolute',
		top : props.initialPosition[1] ,
		left : props.initialPosition[0],
		...props.style,
	}

	if(props.enabled) {
		style.transform = `translate(${node.diffX}px, ${node.diffY}px)` 
	}

	if(node.dragging) {
		style.position = 'absolute'
	}
	
	const draggableProps : any = {
		draggable : props.enabled,
		dragHandlers : handlers,
		style
	}

	const finalProps = mergeDeepLeft(childrenProps, draggableProps) 
	 return React.cloneElement(children, finalProps)
}

export default Draggable
