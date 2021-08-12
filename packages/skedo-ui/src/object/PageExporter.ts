import { NodeJsonStructure, Node, NodeInstanceJsonStructure } from "@skedo/meta"


export default class PageExporter{


	exportToJSON(node : Node) : NodeJsonStructure{
		const data = node.getData().remove('parent')
		const json : Partial<NodeInstanceJsonStructure> = data.toJS()
		const newJson : any = {...json, box : json.box!.toJson()} 
		newJson.children = node.getChildren().map(child => this.exportToJSON(child))
		return newJson as NodeJsonStructure
	}
}