import { Node } from "./instance/Node";
import { Bridge } from "./Bridge";
import {Map as ImmutableMap} from 'immutable'
import { LinkedNode } from "./instance/LinkedNode";
import { BoxDescriptor } from "./BoxDescriptor";

export type SizeUnitInput = {
	value : number,
	unit : string,
	mode : "fill" | "value" | "fixed"
}
export type BoxDescriptorInput = {
  left?: number | string | SizeUnitInput
  top?: number | string | SizeUnitInput
  width: number | string | SizeUnitInput
  height: number | string | SizeUnitInput
  marginLeft?: number | string | SizeUnitInput
  marginTop?: number | string | SizeUnitInput
  marginRight?: number | string | SizeUnitInput
  marginBottom?: number | string | SizeUnitInput
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


export type BasicNodeJsonStructure = {
	type? : string,
	group : string,
	style? : any,
	name : string,
	children? : Array<NodeJsonStructure>,
	id? : number,
	passProps? : any
}

export type NodeInstanceJsonStructure = BasicNodeJsonStructure & {
	box : BoxDescriptor
}

export type NodeJsonStructure = BasicNodeJsonStructure & { 
	box : BoxDescriptorInput
}

export type NodeData = ImmutableMap<string, any>

export type RenderFor = 'react' | 'vue' | 'dom'

export type RenderOptions = {
  key? : string,
  childrenProps? : Record<string, any>,
	ele ? : HTMLElement
}
