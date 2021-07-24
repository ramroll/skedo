import { NodeJsonStructure, Node } from "@skedo/core"


export default class PageExporter{


	exportToJSON(node : Node) : NodeJsonStructure{
		const data = node.getData().remove('parent')
		const json : Partial<NodeJsonStructure> = data.toJS()
		json.children = node.getChildren().map(child => this.exportToJSON(child))
		return json as NodeJsonStructure
	}
}