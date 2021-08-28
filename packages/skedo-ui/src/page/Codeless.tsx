import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CodeProject, FileNodeJson, FileTreeNode, ProjectJson } from "../../../skedo-code/src"
import CodeEditor from "../components/CodeEditor"
import TitleBar from "../components/frame/TitleBar"
import { useCodeEditor } from "../hooks/useCodeEditor"
import { CodeEditorUI, Events } from "../object/CodeEditorUI"
import style from './ui.module.scss'


const EditorContext = React.createContext<CodeEditorUI | null>(null)

export default () => {

  const { page: pageName } =
    useParams<{ [key: string]: string }>()
  const editor = useCodeEditor(pageName) 

  const json = editor.getJSON()
  const show = json !== null

  console.log('render....', editor.getSelectedFile()?.getContent())
  return (
    <EditorContext.Provider value={editor}>
      <TitleBar pageName={pageName} name="codeless" />
      {show && (
        <div className={style.container}>
          <Explorer project={editor!.getProject()} />
          <EditorPanel
            file={editor.getSelectedFile()}
          />
        </div>
      )}
    </EditorContext.Provider>
  )
}


const FileItem = ({
  file,
  depth,
}: {
  file: FileTreeNode
  depth: number
}) => {
  const editor = useContext(EditorContext)
  const active = editor?.getSelectedFile() === file
  if (file.getType() === "file") {
    return (
      <div
        style={{
          paddingLeft : depth * 10 + 10
        }}
        onClick={() => {
          editor?.dispatch(Events.Select, file)
        }}
        className={`${style["editor-file"]} ${
          active ? style.active : ""
        }`}
      >
        {file.getName()}
      </div>
    )
  }
  return (
    <div className={style["editor-dir-group"]}>
      <div
        style={{
          paddingLeft: depth * 10 + 10,
        }}
        className={style["editor-dir"]}
      >
        {file.getName()}
      </div>
      {file.getChildren().map((x) => {
        return <FileItem depth={depth + 1} key={x.getName()} file={x} />
      })}
    </div>
  )
}

const Explorer = ({project} : {project: CodeProject}) => {
  return <div className={style.explorer}>
    <FileItem depth={0} file={project.getRootNode()} />
  </div>
}



const EditorPanel = ({file} : {
  file? : FileTreeNode
}) => {
  const [ver, setVer] = useState(0)
  const editor = useContext(EditorContext)
  useEffect(() => {
    setVer(x => x + 1)
  }, [file?.getContent()])
  return (
    <div key={ver} className={style["code-editor"]}>
      <CodeEditor
        onChange={e => {
          file?.setContent(e)
          editor?.save()
        }}
        code={file?.getContent() || ""}
        lang={file?.getLanguage() || "typescript"}
      />
    </div>
  )
}