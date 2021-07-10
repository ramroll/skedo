import { Node } from "./Node";
import { NodeJsonStructure } from "./NodeJsonStructure";

export interface Page {
	createFromJSON(json : NodeJsonStructure) : Node
}