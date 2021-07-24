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
	onDragstart ? : (e  : DragEvent) => void,
	onDragend ? : (e : DragEvent) => void,
	onDrag? : (e : DragEvent) => void,
}

export type DragEvents = {
	onDragStart ? : (e  : DragNode) => void,
	onDragEnd ? : (e : DragNode) => void,
	onDrag? : (e : DragNode) => void,
}
export type DraggableProps = {
	initialPosition : [number, number]
} & DragEvents

