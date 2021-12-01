import React, {
  useContext,
  useEffect,
  useState,
  useRef
} from "react"
import { useParams } from "react-router-dom"
import {
  CodeProject,
  FileTreeNode,
  ProjectType,
} from "@skedo/code"
import CodeEditor from "../components/CodeEditor"
import TitleBar from "../components/frame/TitleBar"
import { useCodeEditor } from "../hooks/useCodeEditor"
import {
  CodeEditorUI,
  Events,
} from "../object/CodeEditorUI"
import style from "./ui.module.scss"
import { CaretRightOutlined } from "@ant-design/icons"
import { message } from "antd"

const EditorContext =
  React.createContext<CodeEditorUI | null>(null)

export default ({ type }: { type: ProjectType }) => {
  const { page: pageName } =
    useParams<{ [key: string]: string }>()
  const editor = useCodeEditor(type + "-" + pageName, type)

  const json = editor.getJSON()
  const show = json !== null

  const [loading, setLoading] = useState(false)

  return (
    <EditorContext.Provider value={editor}>
      <TitleBar pageName={pageName} name={type}>
        <CaretRightOutlined
          onClick={async (e) => {
            try {
              setLoading(true)
              await editor.build()
              message.success("编译成功")
            } catch (ex) {
              console.error(ex)
              message.error("编译失败")
            } finally {
              setLoading(false)
            }
          }}
          style={{
            fontSize: "32px",
            color: loading ? "grey" : "lightgreen",
          }}
        />
      </TitleBar>

      {show && (
        <div className={style.container}>
          <Explorer editor={editor} />
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
          paddingLeft: depth * 10 + 10,
        }}
        onClick={() => {
          editor?.dispatch(Events.Select, file)
        }}
        className={`${style["editor-file"]} ${
          active ? style.active : ""
        }`}
      >
        <EditableInput
          onValueChanged={fileName => {
            editor?.dispatch(Events.Rename, fileName)
          }}
          active={active}
          defaultText={file.getName()}
        ></EditableInput>
      </div>
    )
  }
  return (
    <div className={style["editor-dir-group"]}>
      <div
        style={{
          paddingLeft: depth * 10 + 10,
        }}
        onClick={() => {
          editor?.dispatch(Events.Select, file)
        }}
        className={`${style["editor-dir"]} ${
          active ? style.active : ""
        }`}
      >
        <EditableInput
          active={active}
          defaultText={file.getName()}
        ></EditableInput>
      </div>
      {file.getChildren().map((x) => {
        return (
          <FileItem
            depth={depth + 1}
            key={x.getName()}
            file={x}
          />
        )
      })}
    </div>
  )
}

const Explorer = ({ editor }: { editor: CodeEditorUI }) => {
  const project = editor.getProject()
  return (
    <div className={style.explorer}>
      <div
        onClick={() => {
          editor?.dispatch(Events.NewFile)
        }}
      >
        +file
      </div>
      <FileItem depth={0} file={project.getRootNode()} />
    </div>
  )
}

const EditorPanel = ({ file }: { file?: FileTreeNode }) => {
  const [ver, setVer] = useState(0)
  const editor = useContext(EditorContext)
  useEffect(() => {
    setVer((x) => x + 1)
  }, [file?.getContent()])

  if (file?.getType() === "dir") {
    return null
  }
  return (
    <div key={ver} className={style["code-editor"]}>
      <CodeEditor
        onChange={(e) => {
          file?.setContent(e)
          editor?.save()
        }}
        code={file?.getContent() || ""}
        lang={file?.getLanguage() || "typescript"}
      />
    </div>
  )
}

const EditableInput = ({
  defaultText,
  active,
  onValueChanged
}: {
  defaultText: string,
  active: boolean,
  onValueChanged? : (v : string) => void

}) => {
  const [text, setText] = useState(defaultText)
  const [editMode, setEditMode] = useState(false)
  const iptRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (active) {
        if (e.key === "F2") {
         console.log('seteditmode', e.key)
          setEditMode(true)
          return
        } else if (e.key === "Enter") {
          setEditMode(false)
          return
        }
      }
    }
    window.addEventListener("keyup", handler)
    return () => {
      window.removeEventListener('keyup', handler)
    }
  }, [active])

  useEffect(() => {
    if(editMode === false && text !== defaultText) {
      onValueChanged && onValueChanged(text)
    }
  }, [editMode, text])

  return (
    <div>
      {editMode && (
        <input
          defaultValue={text}
          ref={iptRef}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
      )}
      {!editMode && <span>{text}</span>}
    </div>
  )
}
