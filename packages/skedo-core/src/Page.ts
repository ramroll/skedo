import { Node } from "./instance/Node";
import { NodeJsonStructure } from "./NodeJsonStructure";

export interface Page {
	createFromJSON(json : NodeJsonStructure) : Node
	// renderExternal(node : Node, elem : Element) : void
}