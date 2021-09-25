import { useState, useRef, useEffect } from 'react'
import classes from './component.module.scss'
export const TextInput = ({
  text,
  onTextChange,
  onStateChange,
}: {
  text: string
  onTextChange?: Function
  onStateChange?: Function
}) => {
  const [state, setState] = useState({
    text: text,
    state: "display",
  })

  const iptRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.text !== text) {
      onTextChange && onTextChange(state.text)
    }
  }, [state.text])

  useEffect(() => {
    onStateChange && onStateChange(state.state)
  }, [state.state])

  useEffect(() => {
    iptRef.current!.value = text
  }, [])

  return (
    <div
      onDoubleClick={(e) => {
        setState((x) => {
          return { ...x, state: "edit" }
        })
        setTimeout(() => {
          iptRef.current!.select()
        }, 5)
      }}
      className={classes["txt-input"]}
    >
      <span
        style={{
          display:
            state.state === "display" ? "block" : "none",
        }}
      >
        {text}
      </span>
      <input
        ref={iptRef}
        onBlur={(e) => {
          setState((x) => {
            return { ...x, state: "display" }
          })
        }}
        style={{
          display:
            state.state === "edit" ? "block" : "none",
        }}
        onChange={(e) => {
          setState((x) => {
            return { ...x, text: e.target.value }
          })
        }}
      />
    </div>
  )
}