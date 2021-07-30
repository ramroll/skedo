import { useContext, useEffect, useRef } from 'react'
import { Bridge, CordNew, Topic } from '@skedo/core'
import RenderContext from '../render/RenderContext'
import classes from './component.module.scss'
import ListRender from './ListRender'
import useBound from '../../hooks/useBound'
const Row = ({bridge} : {bridge : Bridge}) => {

	const ctx = useContext(RenderContext)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {

		const node = bridge.getNode()
		const editor = ctx.editor!

		editor.on(Topic.GeneralMovingEvent)
			.subscribe(([x, y]) => {
				const rect = ref.current!.getBoundingClientRect()
				if(x >= rect.left && x <= rect.left + rect.width) {
					if(y >= rect.top && y <= rect.top + rect.height) {
						if(editor.selection.size() > 0) {

							/// TODO: 增加对Flexbox布局的拖拽支持
						
						}
					}
				}
				
			})
	}, [])

	return <div className={classes.row} ref={ref}>
		<ListRender bridge={bridge} childrenProps={{
			style : {
				position : ""
			}
		}} />
	</div>
}

export default Row