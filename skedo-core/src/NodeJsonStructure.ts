import { BoxDescriptor, BoxDescriptorInput } from "./BoxDescriptor";

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
