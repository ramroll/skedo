import { Bridge, SkedoComponentProps } from "@skedo/meta"

export default ({bridge} : SkedoComponentProps) => {
  const data = bridge.getNodeData()
  return <p>{data || "没有设置文本"}</p>
}