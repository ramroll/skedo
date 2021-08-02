import { useEffect, DragEvent, useMemo, useRef, useState, useContext } from 'react'
import { sizeUnitToNumber, Topic } from '@skedo/meta'
import useBound from '../../hooks/useBound'
import RenderContext from './RenderContext'
import Shadow from './Shadow'
import UIModel, { UIEvents } from '../../object/UIModel'
import classes from './render.module.scss'
import {throttle, Rect} from '@skedo/utils'
import AssistLineSVG from '../assistline/AssistLineSVG'
import { useSubscribe } from '../../hooks/useSubscribe'
import { LineDescriptor } from '../../object/AssistLine'

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


type VecRef = {
  vec : [number, number] | null
}
export default ({
  children,
  editor,
}: {
  children: JSX.Element
  editor: UIModel
}) => {
  const [rect, ref] = useBound()
  const vec = useRef<VecRef>({
    vec : null 
  })
  const vecStart = useRef<VecRef>({
    vec : null
  })
  const [position, setPosition] = useThrottledState<
    [number, number]
  >([0, 0], 5)
  const renderContext = useContext(RenderContext)
  const [assistState, setAssistState] = useState<{
    lines :Array<LineDescriptor>,
    show : boolean 
  }>(
    {lines :[], show : false}
  )
  useMemo(() => {
    renderContext.editor = editor
  }, [])

  useEffect(() => {
    if (rect !== Rect.ZERO) {
      const childRect =
        ref.current!.children[0].getBoundingClientRect()
      const scrollLeft = (childRect.width - rect.width) / 2
      ref.current!.scrollTo(scrollLeft, 0)
      renderContext.cord.setViewPort(rect)
    }
  }, [rect])

  useSubscribe(
    [editor, Topic.AssistLinesChanged],
    (assistState) => {
      setAssistState(assistState)
    }
  )

  return (
    <RenderContext.Provider value={renderContext}>
      <div
        className={classes.panel}
        onMouseMove={(e) => {
          e.preventDefault()
          // pass Events to Sel

          editor.selection.forEach((node) => {
            node.emit(Topic.MouseMoveEventPass, e)
          })

          editor.emit(Topic.GeneralMovingEvent, {clientX : e.clientX, clientY: e.clientY, target : e.target})
          editor.dispatch(UIEvents.EvtMoving, [e.clientX, e.clientY])
          // Hanlde drop insert
          const meta = editor.dropCompoentMeta
          if (!meta) {
            // common moving
            return
          }
          const box = meta.box

          const [maxW, maxH] = editor.page.pageNode.getWH()
          const w = sizeUnitToNumber(
            "width",
            box.width,
            maxW,
            maxH
          )
          const h = sizeUnitToNumber(
            "height",
            box.height,
            maxW,
            maxH
          )
          setPosition([
            e.clientX - w / 2,
            e.clientY - h / 2,
          ])
          const position = [
            renderContext.cord.worldX(e.clientX) - w / 2,
            renderContext.cord.worldY(e.clientY) - h / 2,
          ]
          editor.dispatch(UIEvents.EvtAddDraging, position)
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          vec.current.vec = null
          vecStart.current.vec = null
          editor.selection.forEach((node) => {
            node.emit(Topic.MouseUpEventPass, e)
          })
          editor.emit(Topic.MouseUpEventPass, e)
          editor.dispatch(UIEvents.EvtDrop)
          setPosition([0, 0])
        }}
      >
        <div
          className={classes["panel-scrollview"]}
          ref={ref}
          onScroll={(e) => {
            renderContext.cord.updateScroll(
              ref.current!.scrollLeft,
              ref.current!.scrollTop
            )
          }}
        >
          <Shadow
            position={position}
            meta={editor.dropCompoentMeta}
          />
          {children}
        </div>
        <AssistLineSVG lines={assistState.lines} show={assistState.show} />
      </div>
    </RenderContext.Provider>
  )
}