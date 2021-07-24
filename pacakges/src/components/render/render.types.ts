import EditorModel from "../../object/EditorModel";
import {Bridge, Node} from '@skedo/core'

export type NodeRenderProps = {
	node : Node,
	editor : EditorModel 
}


export type RenderedComponentProps = {
	bridge : Bridge
}
