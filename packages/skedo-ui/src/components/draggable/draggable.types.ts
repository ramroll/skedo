import DragNode from "./DragNode"

export type DragData = {
	dragging : boolean,
	startX : number,
	startY : number,
	x : number,
	y : number,
	diffX : number,
	diffY : number
}
export type RawDragEvents = {
	onDragStart ? : (e  : DragEvent) => void,
	onDragEnd ? : (e : DragEvent) => void,
	onDrag? : (e : DragEvent) => void,
}

export type DragEvents = {
	onDragStart ? : (e  : DragNode) => void,
	onDragEnd ? : (e : DragNode) => void,
	onDrag? : (e : DragNode) => void,
}
export type DraggableProps = DragEvents

