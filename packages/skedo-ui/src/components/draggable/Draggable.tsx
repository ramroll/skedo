import { useDragNode } from "./useDragNode"
import DragNode from "./DragNode"
import { DragEvents } from "./draggable.types"
import React from "react"
import { mergeDeepLeft } from 'ramda'

type DraggableProps = {
	initialPosition : [string, string],
	children : JSX.Element,
	enabled : boolean,
} & DragEvents 


const Draggable = (props : DraggableProps) : JSX.Element => {
	const [node, handlers] = useDragNode(props, props.initialPosition)

	const children = props.children
	const childrenProps = children.props
	const draggableProps : any = props.enabled ? {
		draggable : true,
		dragHandlers : handlers,
		style :{
			position : 'absolute',
			top : props.initialPosition[1] ,
			left : props.initialPosition[0],
			transform : `translate(${node.diffX}px, ${node.diffY}px)`
		}
	} : {
		style : {
			position : 'absolute',
			top : props.initialPosition[1],
			left : props.initialPosition[0],
		}
	}

	const finalProps = mergeDeepLeft(childrenProps, draggableProps) 
	 return React.cloneElement(children, finalProps)
}

export default Draggable