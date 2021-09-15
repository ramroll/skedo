import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  CodeProject,
  FileTreeNode,
  ProjectType,
} from "@skedo/code"
import CodeEditor from "../components/CodeEditor"
import TitleBar from "../components/frame/TitleBar"
import { useCodeEditor } from "../hooks/useCodeEditor"
import { CodeEditorUI, Events } from "../object/CodeEditorUI"
import style from './ui.module.scss'
import {CaretRightOutlined} from '@ant-design/icons'
import {message} from 'antd'


const EditorContext = React.createContext<CodeEditorUI | null>(null)

export default ({type} : {
  type : ProjectType
}) => {

  const { page: pageName } =
    useParams<{ [key: string]: string }>()
  const editor = useCodeEditor(type + '-' + pageName, type) 

  const json = editor.getJSON()
  const show = json !== null

  return (
    <EditorContext.Provider value={editor}>
      <TitleBar pageName={pageName} name={type}>
        <CaretRightOutlined onClick={
          async (e) => {
            try {
              await editor.build()
              message.success("编译成功")
            } catch (ex) {
              console.error(ex)
              message.error("编译失败")
            }
          }
        } style={{fontSize:'32px', color : 'lightgreen'}} />

      </TitleBar>

      {show && (
        <div className={style.container}>
          <Explorer project={editor!.getProject()} />
          <EditorPanel file={editor.getSelectedFile()} />
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