import { Bridge, Topic, Node } from '@skedo/core'
import { useEffect, useState } from 'react'
import classes from './component.module.scss'
import ListRender from './ListRender'
const FlexContainer = ({bridge, gap} : {bridge : Bridge, gap : string}) => {

  const [children, setChildren] = useState<Array<Node | string>>(bridge.getNode().getChildren())

	useEffect(() => {
		const sub = bridge.node.on([Topic.NewNodeAdded, Topic.NodeChildrenChanged])
			.subscribe(() => {
        setChildren(bridge.node.getChildren())
			})
		return () => {
			sub.unsubscribe()
		}
	},[])

  useEffect(() => {
    const node = bridge.getNode()
    node.on(Topic.NodeGapIndexChanged)
      .subscribe(gapIndex => {
        if(gapIndex !== null) {
          const list : Array<Node|string> = node.getChildren() 
          list.splice(gapIndex, 0, `__${gap.toUpperCase()}__`)
          setChildren(list)
        } else {
          setChildren(node.getChildren())
        }
      })
  }, [])

	return (
    <div
      className={classes[gap]}
    >
      <ListRender
        children={children}
        bridge={bridge}
        childrenProps={{
          style: {
            position: "",
          },
        }}
      />
    </div>
  )
}

export default FlexContainer