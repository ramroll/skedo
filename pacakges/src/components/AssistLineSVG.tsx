import { useEffect, useState } from 'react'
import Selection from '../object/Selection'
import {Topic } from '@skedo/core'
import styles from '../style/core.module.scss'
import Page from '../object/Page'
import { LineDescriptor } from '../object/AssistLine'


interface AssistLinesProps {
  selection : Selection,
  page : Page,
  scrollLeft : number,
  scrollTop : number
}

const AssistLineSVG =  ({selection, scrollLeft, scrollTop, page} : AssistLinesProps) => {

  const [lines, setLines] = useState<Array<LineDescriptor>>([]) 

  useEffect(() => {
    
    const s = selection.assistLine
      .on(Topic.AssistLinesChanged)
      .subscribe((lines : Array<LineDescriptor>) => {
        setLines(lines)
      })
    return () => {
      s && s.unsubscribe()
    }
  }, [selection.assistLine])



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
            y1={relativePos}
            x2={page.root.getRect().width}
            y2={relativePos}
          ></line>
        )
      }
      else {
        const relativePos = Number(line.pos)
        return (
          <line
            style={style}
            key={"1" + line.pos}
            x1={relativePos}
            y1={0}
            x2={relativePos}
            y2={page.root.getRect().height}
          ></line>
        )
      }
    })}
  </svg> 

}

export default AssistLineSVG