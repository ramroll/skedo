import EditorModel from '../object/EditorModel'
import { Node } from '@skedo/core'
import ComponentTreeNode from "./ComponentTreeNode"
type InjectComponentProps = {
	node : Node,
	editor : EditorModel
}
const InjectComponent = ({node, editor} : InjectComponentProps) => {
	return <ComponentTreeNode node={node} editor={editor} />
}

export default InjectComponent