import { useContext } from 'react'
import { ComponentMeta, sizeUnitToString } from '@skedo/meta'
import classes from './render.module.scss'
import RenderContext from './RenderContext'
export default ({meta, position} : {meta : ComponentMeta | null, position : [number, number]}) => {
	const context = useContext(RenderContext)
	if(!meta) {
		return null
	}
	return (
    <div
      className={classes.shadow}
      style={{
        transform: `translate(${context.cord.worldX(
          position[0]
        )}px, ${context.cord.worldY(position[1])}px)`,
        width: sizeUnitToString(meta.box.width),
        height: sizeUnitToString(meta.box.height),
      }}
    ></div>
  )
}