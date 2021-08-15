import { JsonNode, JsonPage, Node } from "@skedo/meta"


export default class PageExporter{


	exportToJSON(node : Node) : JsonPage{
		const links : Record<number, JsonNode> = {}
		const page = node.toJSON(links)
		return {
			links,
		  page	
		}
	}
}