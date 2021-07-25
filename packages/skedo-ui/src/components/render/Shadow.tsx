import { useContext } from 'react'
import { ComponentMeta, sizeUnitToString } from '@skedo/core'
import classes from './render.module.scss'
import RenderContext from './RenderContext'
export default ({meta, position} : {meta : ComponentMeta | null, position : [number, number]}) => {
	const context = useContext(RenderContext)
	if(!meta) {
		return null
	}
  console.log(context.worldX(position[0]), context.worldY(position[1]))
	return (
    <div
      className={classes.shadow}
      style={{
        transform: `translate(${context.worldX(position[0])}px, ${context.worldY(position[1])}px)`,
        width: sizeUnitToString(meta.box.width),
        height: sizeUnitToString(meta.box.height),
      }}
    ></div>
  )
}