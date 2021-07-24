import { useEffect, useState, useRef } from 'react'
import {BoldOutlined, ItalicOutlined } from "@ant-design/icons"

interface FontStyleSelectorProps {
  onChange : (v : Set<string>) => void,
  initialValue : Set<string> 
}
const FontStyleSelector = ({onChange, initialValue} : FontStyleSelectorProps) => {
  const [styles, setStyles] = useState(initialValue || new Set<string>())
  const dirty = useRef(false)

  useEffect(() => {
    if(dirty.current === false) {
      return
    }
    onChange(styles)
  }, [styles, dirty, onChange])


  function toggle(set : Set<string>, value :string) {
    dirty.current = true
    if(set.has(value)) {
      set.delete(value)
    } else{
      set.add(value)
    }
    setStyles(new Set<string>(set))
  }
  return <div>
    <BoldOutlined onClick={() => toggle(styles, "bold")} style={{
      color : styles.has("bold") ? "black" : "grey"
    }} />
    <ItalicOutlined onClick={() => toggle(styles, "italic")} style={{
      color : styles.has("italic") ? "black" : "grey"
    }} />
  </div>
}

export default FontStyleSelector