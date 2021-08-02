
import  { MouseEvent, useRef, useMemo, useEffect, MouseEventHandler, useContext} from "react"
import {Node} from '@skedo/meta'
import { UIEvents } from "../../object/UIModel"
import ResizerNew from '../../object/Resizer.new'
import RenderContext from "../render/RenderContext"
import styles from './selectable.module.scss'

type SelectionProps = {
	selected : boolean,
	children : JSX.Element,
  onSelectChanged : (selected : boolean) => void ,
  onMouseDown? : MouseEventHandler,
  onMouseUp? : MouseEventHandler,
  node : Node

}

const Selectable = ({
  selected,
  children,
  onSelectChanged,
  onMouseDown,
  onMouseUp,
  node
}: SelectionProps) => {
  const selectionValue = useRef(selected)

  useEffect(() => {
    selectionValue.current = selected
  }, [selected])

  const handlers = useMemo(() => {
    let startSelected = false
    let startX = 0,
      startY = 0
    return {
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        startSelected = selectionValue.current
        startX = e.clientX
        startY = e.clientY
        if (!selectionValue.current) {
          selectionValue.current = true
          onSelectChanged(true)
        }
        onMouseDown && onMouseDown(e)
      },

      onMouseUp: (e: MouseEvent) => {
        const moved =
          e.clientX !== startX || e.clientY !== startY
        if (startSelected && !moved) {
          onSelectChanged(false)
          selectionValue.current = false
        }
        onMouseUp && onMouseUp(e)
      },
    }
  }, [])

  const context = useContext(RenderContext)

  return (
    <div className={styles.selectable} {...handlers}>
      <div
        className={styles.selection_frame}
        style={{
          display: selected ? "block" : "none",
        }}
      />
      {children}
      {selected &&
        ResizerNew.resizerData.map(([name, type]) => {
          return (
            <div
              key={name + ""}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                context.editor!.dispatch(
                  UIEvents.EvtStartResize,
                  type,
                  [e.clientX, e.clientY],
                  node
                )
              }}
              data-cube={type}
              className={`${styles.cube} ${
                styles["cube_" + name]
              }`}
            />
          )
        })}
    </div>
  )
}

export default Selectable