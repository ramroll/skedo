import { BoxDescriptor, BoxDescriptorInput } from "./BoxDescriptor";

export type NodeJsonStructure = {
	type : string,
	group : string,
	style : any,
	children : Array<NodeJsonStructure>,
	id? : number,
	passProps? : any,
	box : BoxDescriptor | BoxDescriptorInput
}
