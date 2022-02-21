import { ref, SetupContext, VNode } from "vue"
import {lexicalCache, lexicalScoped} from '@skedo/vue-lexical-cache'
import { DragEvents, DraggableProps, RawDragEvents } from "../types/editor.types"
import { useDragNode } from "../hook/useDragNode"
import DragNode from "../object/DragNode"
import { deepMerge } from "../util/deepMerge"

lexicalScoped('ref')

function assignPropsToVNode(vNode : VNode, props : any) {
	vNode.props = deepMerge(vNode.props, props) 
	return vNode
}

function addPropsToVNode(vNode : VNode, handlers : RawDragEvents, props : DraggableProps, node : DragNode) {

	const vNodeProps : any = {
		...handlers,
		draggable : true
	}

	vNodeProps.style = {
		position : 'absolute',
		top : props.initialPosition[1] + 'px',
		left : props.initialPosition[0] + 'px',
		transform : `translate(${node.diffX}px, ${node.diffY}px)`
	}

	vNode = assignPropsToVNode(vNode, vNodeProps)
	return vNode
}

const Draggable = (props : DraggableProps, ctx : SetupContext) => {
	const [node, handlers] = useDragNode(props, props.initialPosition)
	let vNode : VNode = ctx.slots.default!()[0]
	vNode = addPropsToVNode(vNode, handlers, props, node.value)
	return vNode
}

export default Draggable
// <Draggable><div a={1}>...</div></Draggable>