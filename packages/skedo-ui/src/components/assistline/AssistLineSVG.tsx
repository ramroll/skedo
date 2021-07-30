import styles from './assistline.module.scss'
import { LineDescriptor } from '../../object/AssistLine'
import { useContext } from 'react'
import RenderContext from '../render/RenderContext'


interface AssistLinesProps {
  lines : Array<LineDescriptor>,
  show : boolean
}

const AssistLineSVG =  ({lines, show} : AssistLinesProps) => {




  const context = useContext(RenderContext)
  if(!show) {
    return null
  }
  return <svg className={styles["assist-lines"]} style={{
    zIndex : lines.length === 0 ? -1 :1
  }}>
    {lines.map((line) => {
      const style = {
        stroke : line.type === 0 ? (line.distance < 1 ? "black" : "#ccc" )
          : (line.distance < 1 ? "#ff0000" : "#ff9e9e")
      }
      if(line.dir === 0) {
        const relativePos = Number(line.pos)
        return (
          <line
            style={style}
            key={"0" + line.pos}
            x1="0"
            y1={relativePos - context.cord.scrollY}
            x2={context.cord.viewport.width}
            y2={relativePos - context.cord.scrollY}
          ></line>
        )
      }
      else {
        const relativePos = Number(line.pos)
        return (
          <line
            style={style}
            key={"1" + line.pos}
            x1={relativePos - context.cord.scrollX}
            y1={0}
            x2={relativePos - context.cord.scrollX}
            y2={context.cord.viewport.height}
          ></line>
        )
      }
    })}
  </svg> 

}

export default AssistLineSVG