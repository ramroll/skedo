
import  { MouseEvent, useRef, useMemo, useEffect, MouseEventHandler} from "react"
import ResizerNew from '../../object/Resizer.new'
import styles from './selectable.module.scss'

type SelectionProps = {
	selected : boolean,
	children : JSX.Element,
  onSelectChanged : (selected : boolean) => void ,
  onMouseDown? : MouseEventHandler,
  onMouseUp? : MouseEventHandler,

}

const Selectable = ({selected ,children, onSelectChanged, onMouseDown, onMouseUp } : SelectionProps) => {

  const selectionValue = useRef(selected)

  useEffect(() => {
    selectionValue.current = selected
  }, [selected])

  const handlers = useMemo(() => {
    let startSelected = false
    let startX = 0, startY = 0
    return {
      onMouseDown  : (e : MouseEvent) => {
        e.stopPropagation()
        startSelected = selectionValue.current
        startX = e.clientX
        startY = e.clientY
        if(!selectionValue.current) {
          selectionValue.current = true
          onSelectChanged(true)
        }
        onMouseDown && onMouseDown(e)
        
      },
      
      onMouseUp : (e : MouseEvent) => {

        const moved = e.clientX !== startX || e.clientY !== startY
        if(startSelected && !moved) {
          onSelectChanged(false)
          selectionValue.current = false
        }
        onMouseUp&& onMouseUp(e)
      }
    }
  },[])

  return (
    <div
      className={styles.selectable}
      {...handlers}
    >
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