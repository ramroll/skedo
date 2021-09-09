import { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { Topic } from '@skedo/meta'
import useBound from '../../hooks/useBound'
import RenderContext from './RenderContext'
import Shadow from './Shadow'
import UIModel, { UIEvents } from '../../object/UIModel'
import classes from './render.module.scss'
import "./render.scss"
import {throttle, Rect, debounce} from '@skedo/utils'
import AssistLineSVG from '../assistline/AssistLineSVG'
import { useSubscribe } from '../../hooks/useSubscribe'
import { LineDescriptor } from '../../object/AssistLine'

function isFunction<T>(val : T | (() => T)) : val is (() => T){
	return typeof val === 'function'
}

function useThrottledState<T>(initialState : T, interval = 16) : [T, (val : (T|(() => T))) => void] {
	const state = useRef<T>(initialState)
	const [, setVer] = useState(0)

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

    let keys = new Set<string>()
    
    window.addEventListener("keydown", (e) => {
      keys.add(e.key)
    })

    window.addEventListener("keyup", debounce((e) => {
      editor.handleHotKeys([...keys])
      keys.delete(e.key)
      keys.clear()
    }, 100))
  }, [rect])

  useEffect(() => {

  }, [])

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
          // const box = meta.box
          // const w = box.width.toNumber()
          // const h = box.height.toNumber()
          
          setPosition([
            e.clientX ,
            e.clientY ,
          ])
          const position = [
            renderContext.cord.worldX(e.clientX) ,
            renderContext.cord.worldY(e.clientY) ,
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