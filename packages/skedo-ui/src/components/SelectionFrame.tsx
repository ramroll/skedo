
import React, {useState, useEffect} from "react"
import {Topic, Node} from '@skedo/core'
import Selection from '../object/Selection'
import Resizer from '../object/Resizer'
import styles from '../style/core.module.scss'


type SelectionProps = {
  node : Node,
  selection : Selection
}


const SelectionFrame = ({node, selection} : SelectionProps) => {

  const [, setVer] = useState(0)
  useEffect(() => {
    const subscription = node.on(Topic.SelectionChanged).subscribe(() => {
      setVer(x => x + 1)
    })

    return () => {
      subscription && subscription.unsubscribe()
    }
  }, [node])
  
  const show = selection.contains(node)


  return <React.Fragment>
    <div className={styles.selection_frame} style={{
      display : show ? "block" : "none"
    }}/>
    {show && Resizer.resizerData.map((([name, type])=> {
      return <div key={name+""} data-cube={type} className={`${styles.cube} ${styles["cube_"+name]}`} />
    }))}
  </React.Fragment>
}

export default SelectionFrame