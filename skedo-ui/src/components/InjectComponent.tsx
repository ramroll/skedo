import Node from '../object/Node'
import ComponentTreeNode from "./ComponentTreeNode"
type InjectComponentProps = {
	node : Node
}
const InjectComponent = ({node} : InjectComponentProps) => {
	return <ComponentTreeNode node={node} editor={node.editor} />
}

export default InjectComponent