
import {
  MouseEvent,
  useMemo,
  MouseEventHandler,
  useContext,
  useState,
} from "react"
import {Node, Topic} from '@skedo/meta'
import { UIEvents } from "../../object/UIModel"
import ResizerNew from '../../object/Resizer.new'
import RenderContext from "../render/RenderContext"
import styles from './selectable.module.scss'
import { useSubscribe } from "../../hooks/useSubscribe"

type SelectionProps = {
	children : JSX.Element,
  onSelectChanged : (selected : boolean) => void ,
  onMouseDown? : MouseEventHandler,
  onMouseUp? : MouseEventHandler,
  node : Node

}

const Selectable = ({
  children,
  onSelectChanged,
  onMouseDown,
  onMouseUp,
  node
}: SelectionProps) => {
  const ctx = useContext(RenderContext)
  const [,setVer] = useState(0)

  function selected(){
    return ctx.editor!.selection.contains(node)
  }

  useSubscribe([ctx.editor!, Topic.SelectionChanged], () => {
    setVer((x) => x + 1)

  })

  const handlers = useMemo(() => {
    let startSelected = false
    let startX = 0,
      startY = 0
    return {
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        startSelected = selected()
        startX = e.clientX
        startY = e.clientY
        if (!startSelected) {
          onSelectChanged(true)
        }
        onMouseDown && onMouseDown(e)
      },

      onMouseUp: (e: MouseEvent) => {
        const moved =
          e.clientX !== startX || e.clientY !== startY
        if (startSelected && !moved) {
          onSelectChanged(false)
        }
        onMouseUp && onMouseUp(e)
      },
    }
  }, [])

  const context = useContext(RenderContext)

  const selectedValue = selected()
  return (
    <div className={styles.selectable} {...handlers}>
      <div
        className={styles.selection_frame}
        style={{
          display: selectedValue ? "block" : "none",
        }}
      />
      {children}
      {selectedValue && node.isResizable() &&
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