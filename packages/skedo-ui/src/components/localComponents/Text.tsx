import React, {useState, useRef, useEffect} from 'react'
import styles from './component.module.scss'
import {Bridge, Topic} from '@skedo/core'


interface TextProps {
  text : string,
  bridge : Bridge,
  color : string,
  fontFamily : string ,
  fontStyle : Set<string>,
  align : "left" | "right" | "center",
  fontSize : number
}

const Text: React.FC<TextProps> = ({
  text,
  fontSize,
  fontStyle = new Set<string>(),
  align,
  color,
  fontFamily,
  bridge,
}: TextProps) => {
  const [state, setState] = useState(0)
  const [txt, setText] = useState(text)
  const ref = useRef<HTMLDivElement>(null)
  const iptRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const sub = bridge.node
      .on(Topic.EditMode)
      .subscribe((value) => {
        setState(value ? 1 : 0)
      })
    return () => {
      sub.unsubscribe()
    }
  }, [bridge.node])

  useEffect(() => {
    if (txt !== text) {
      bridge.setPropsValue("text", txt)
    }
  }, [txt])

  useEffect(() => {
    if (state === 1) {
      iptRef.current?.focus()
    }
    // bridge.triggerAutoResizing()
  }, [state])

  const style: any = {
    fontFamily: fontFamily,
    fontSize,
    textAlign: align,
    color,
  }

  if (fontStyle.has("bold")) {
    style.fontWeight = "bold"
  }
  if (fontStyle.has("italic")) {
    style.fontStyle = "italic"
  }

  return (
    <div className={styles.text} style={style}>
      <div
        style={{
          display: state === 0 ? "block" : "none",
        }}
        ref={ref}
      >
        {txt}
      </div>
      <input
        ref={iptRef}
        value={txt}
        onChange={(e) => {
          setText(
            (s) => (e.target as HTMLInputElement).value
          )
        }}
        style={{ display: state === 0 ? "none" : "block" }}
        onBlur={() => {
          setState(0)
        }}
      />
    </div>
  )
}

export default Text