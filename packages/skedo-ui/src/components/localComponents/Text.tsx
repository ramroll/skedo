import React, {useState, useRef, useEffect} from 'react'
import styles from './component.module.scss'
import {Bridge, Topic} from '@skedo/meta'
import {TextInput} from './TextInput'


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
      <TextInput 
        onTextChange={(text: string) => {
          bridge.setPropValue(["text"], text)
        }}
        text={text} />
    </div>
  )
}

export default Text