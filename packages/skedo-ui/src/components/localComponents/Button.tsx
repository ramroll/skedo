import {useState, useRef, useEffect} from 'react'
import styles from './component.module.scss'
import { Bridge } from "@skedo/meta"

interface ButtonProps {
  text : string,
  bridge : Bridge,
  color : string,
  fontFamily : string ,
  fontStyle : Set<string>,
  align : "left" | "right" | "center",
  fontSize : number
}

const Button = ({text, fontSize, fontStyle = new Set<string>(), align, color, fontFamily, bridge}  : ButtonProps) => {
  const [state, setState] = useState(0)
  const [txt, setText] = useState(text)
  const ref = useRef<HTMLButtonElement>(null)
  const iptRef = useRef<HTMLInputElement>(null)



  useEffect(() => {
    if(state === 1) {
      iptRef.current?.focus()
    }
  }, [state])

  useEffect(() => {
    if(txt !== text) {
      // console.log('text changed.')
      bridge.setPropsValue('text', txt)
    }
  }, [txt])

  const style : any = {
    fontFamily : fontFamily,
    fontSize,
    textAlign: align,
    color 
  }

  if(fontStyle.has("bold")) {
    style.fontWeight = "bold"
  }
  if(fontStyle.has("italic")) {
    style.fontStyle = "italic"
  }

  return <div className={styles.button} style={style}>
    <button
      style={{
        display: state === 0 ? "block" : "none", 
      }} 
      ref={ref}>{txt}
    </button>
    <input  ref={iptRef} value={txt} onChange={e => {
      setText(s => (e.target as HTMLInputElement).value)
    }} style={{display: state === 0 ? "none" : "block"}} onBlur={() => {
      setState(0)
    }} />

  </div>

}

export default Button