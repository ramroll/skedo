import { Node } from "./instance/Node";
import { Bridge } from "./Bridge";
import {Map as ImmutableMap} from 'immutable'
import { LinkedNode } from "./instance/LinkedNode";

export type BoxDescriptorInput = {
	left? : number | string  
	top? :  number | string
	width :  number | string
	height :  number | string
	marginLeft? :  number | string
	marginTop? :  number | string
	marginRight? :  number | string
	marginBottom? :  number | string,
	mode : string 
}

export type SkedoComponentProps = {
	bridge : Bridge
}

export type NodeRenderProps = {
	node : Node,
	inheritProps? : any
}


export type RenderedComponentProps = {
	bridge : Bridge
}


export type NodeType = Node | LinkedNode

export type NodeJsonStructure = {
	type? : string,
	group : string,
	style : any,
	name : string,
	children : Array<NodeJsonStructure>,
	id? : number,
	passProps? : any,
	box : BoxDescriptor | BoxDescriptorInput
}

export declare type NodeData = ImmutableMap<string, any>