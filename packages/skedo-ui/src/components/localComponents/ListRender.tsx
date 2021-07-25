import { sizeUnitToString, SkedoComponentProps, Topic } from '@skedo/core'
import { useEffect, useState } from 'react'
export default ({bridge, className} : SkedoComponentProps & {className : string}) => {
	const node = bridge.node
	const [ver, setVer] = useState(0)

	useEffect(() => {
		const sub = node.on([Topic.NewNodeAdded])
			.subscribe(() => {
				setVer(x => x + 1)
			})
		return () => {
			sub.unsubscribe()
		}

	},[])

	return <>
		{node.getChildren().map(childNode => {
			return bridge.renderAsReact(childNode, childNode.getId())
		})}
	</>
}