import { BoxDescriptor, NodeJsonStructure } from "@skedo/core";
import ComponentsLoader from "./ComponentsLoader";
import EditorModel from "./EditorModel";
import Node from "./Node";
import { fromJS, Map as ImmutableMap } from 'immutable'

export default class PageImporter {
	
	editor : EditorModel
	constructor(editor : EditorModel) {
		this.editor = editor
	}

	importNode(json : NodeJsonStructure, parent : Node | null = null) : Node {
		const data = (fromJS(json) as ImmutableMap<string, any>)
			.set("parent", parent)
		const node = new Node(
      this.editor,
      json.box as BoxDescriptor,
      ComponentsLoader.loadByType(json.group, json.type),
			false,
			data
    )
		const children = json.children.map( child => this.importNode(child, node))
		node.setChildren(children)
		return node
	}
}