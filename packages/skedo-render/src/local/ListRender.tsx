import { SkedoComponentProps } from '@skedo/meta'
export default ({bridge} : SkedoComponentProps ) => {
	const node = bridge.getNode()
	return <>
		{node.getChildren().map(childNode => {
			return bridge.render('react', childNode, {
				key : childNode.getId()	+ ""
			})
		})}
	</>
}