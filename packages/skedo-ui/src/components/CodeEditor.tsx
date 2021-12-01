import Editor from "@monaco-editor/react"
import {debounce} from '@skedo/utils'

export default ({
  code,
  lang,
  onChange,
}: {
  code: string
  lang: string,
	onChange : (e : string) => void
}) => {
  return (
    <Editor
      theme="vs-dark"
      language={lang}
      onChange={debounce((e) => {
        onChange(e || "")
      }, 2000)}
      defaultValue={code}
      options={{
        fontSize: 24,
      }}
    />
  )
}