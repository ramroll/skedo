import { useEffect, DragEvent, useMemo, useRef, useState, useContext } from 'react'
import { Rect, sizeUnitToNumber } from '@skedo/core'
import useBound from '../../hooks/useBound'
import RenderContext from './RenderContext'
import Shadow from './Shadow'
import EditorModel, { UIEvents } from '../../object/EditorModel'
import classes from './render.module.scss'
import {throttle} from '@skedo/core'

const handleDragOver = (e : DragEvent) => {
	e.preventDefault()	
}

function isFunction<T>(val : T | (() => T)) : val is (() => T){
	return typeof val === 'function'
}

function useThrottledState<T>(initialState : T, interval = 16) : [T, (val : (T|(() => T))) => void] {
	const state = useRef<T>(initialState)
	const [ver, setVer] = useState(0)

	const setState = useMemo(() => {
		const fn = (val : T | (() => T))  => {
			if(isFunction(val)) {
				val = val()
			}
			state.current = val
			setVer(x=>x+1)
		}

		return throttle(fn, interval)
	}, [])

	return [state.current, setState]

}

export default ({children, editor} : {children : JSX.Element, editor : EditorModel}) => {
	const [rect, ref] = useBound()
	const [position, setPosition] = useThrottledState<[number, number]>([0, 0], 5)
	const renderContext = useContext(RenderContext)
	useMemo(() => {
		renderContext.editor = editor
	},[])

	useEffect(() => {
		if(rect !== Rect.ZERO) {
			const childRect = ref.current!.children[0].getBoundingClientRect()
			const scrollLeft = (childRect.width - rect.width)/2
			ref.current!.scrollTo(scrollLeft, 0)
			renderContext.cord.setViewPort(rect)
		}
	}, [rect])


	return (
    <RenderContext.Provider value={renderContext}>
      <div
        className={classes.panel}
        ref={ref}
        onScroll={(e) => {
          renderContext.cord.updateScroll(
            ref.current!.scrollLeft,
            ref.current!.scrollTop
          )
        }}
        onMouseMove={(e) => {
          e.preventDefault()
					
					const meta = editor.dropCompoentMeta
					if(!meta) {
						return
					}
					const box = meta.box


					const [maxW, maxH] = editor.page.pageNode.getWH()
					const w = sizeUnitToNumber('width', box.width, maxW, maxH)
					const h = sizeUnitToNumber('height', box.height, maxW, maxH)
          setPosition([e.clientX - w/2, e.clientY-h/2])
					const position = [renderContext.cord.worldX(e.clientX) - w/2, renderContext.cord.worldY(e.clientY) - h/2]
					editor.dispatch(UIEvents.EvtAddDraging, position)

        }}
        onMouseUp={(e) => {
					e.preventDefault()
					editor.dispatch(UIEvents.EvtDrop)
					setPosition([0, 0])
				}}
      >
        <Shadow
          position={position}
          meta={editor.dropCompoentMeta}
        />
        {children}
      </div>
    </RenderContext.Provider>
  )
}