import { NodeJsonStructure } from "@skedo/core"
import Node from "./Node";


export default class PageExporter{


	exportToJSON(node : Node) : NodeJsonStructure{
		const data = node.data.remove('parent')
		const json : Partial<NodeJsonStructure> = data.toJS()
		json.children = node.getChildren().map(child => this.exportToJSON(child))
		return json as NodeJsonStructure
	}
}