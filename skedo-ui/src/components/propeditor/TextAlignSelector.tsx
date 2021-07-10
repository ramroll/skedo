import React, { useEffect, useState, useRef } from 'react'
import {AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined} from "@ant-design/icons"

interface TextAlignSelectorProps {
  onChange : (v : string) => void,
  initialValue : string
}
const TextAlignSelector = ({onChange, initialValue} : TextAlignSelectorProps) => {
  const dirty = useRef(false)
  const [sel, setSel] = useState(initialValue)

  function setSelection(value : string){
    dirty.current = true
    setSel(value)
  }
  useEffect(() => {
    if(dirty.current === false) {
      return
    }
    onChange(sel)
  }, [sel, dirty, onChange])
  return <div>
    <AlignLeftOutlined onClick={() => setSelection("left")} style={{color : sel==="left" ? "black" : "grey"}} />
    <AlignCenterOutlined onClick={() => setSelection("center")}   style={{color : sel==="center" ? "black" : "grey"}} />
    <AlignRightOutlined onClick={() => setSelection("right")}  style={{color : sel==="right" ? "black" : "grey"}} />
  </div>
}

export default TextAlignSelector