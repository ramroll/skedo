import { useContext, useEffect, useState } from 'react'
import { ComponentMeta, Node, Topic } from '@skedo/meta'
import classes from './render.module.scss'
import RenderContext from './RenderContext'
export default ({meta, position} : {meta : ComponentMeta | null, position : [number, number]}) => {
	const context = useContext(RenderContext)
  const [receiver, setReceiver] = useState<Node | null>(null)

  useEffect(() => {
    context.editor!.on(Topic.ShadowReceiverChanged)
      .subscribe((receiver : Node) => {
        setReceiver(receiver)
      })
  }, [])
	if(!meta || !receiver) {
		return null
	}


  const rect = receiver.getRect()

  const width = meta.box.width.toPxNumberWithRect(rect)
  const height = meta.box.height.toPxNumberWithRect(rect)
	return (
    <div
      className={classes.shadow}
      style={{
        transform: `translate(${context.cord.worldX(
          position[0] - width / 2
        )}px, ${context.cord.worldY(position[1] - height / 2)}px)`,
        width,
        height,
      }}
    ></div>
  )
}