import { Bridge, SkedoComponentProps, Topic } from "@skedo/meta"
import { useState, useEffect } from "react"

export default ({bridge} : SkedoComponentProps) => {

  const [, setV] = useState(0)
  const props = bridge.passProps()

  useEffect(() => {

    bridge.on(Topic.MemorizedDataChanged)
      .subscribe(() => {
        setV(x => x + 1)
      })

  },[])
  const data = bridge.getNodeData()
  console.log('here', props)
  return <p style={{
    color : props.color,
    fontSize : props.fontSize,
    fontFamily : props.fontFamily,
    textAlign : props.align
  }}>{data || "没有设置文本"}</p>
}