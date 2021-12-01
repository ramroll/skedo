import { useEffect, useMemo, useState } from "react";
import { ProjectType } from "../../../skedo-code/src";
import { CodeEditorUI, Topic } from "../object/CodeEditorUI";
export function useCodeEditor(page : string, type : ProjectType){

  const editor = useMemo(() => new CodeEditorUI(page, type), [])
  const [, setVer] = useState(0)

  useEffect(() => {
    editor
      .on([
        Topic.SelectionChanged,
        Topic.Loaded,
        Topic.FileAdded,
        Topic.FileRenamed,
      ])
      .subscribe(() => {
        setVer((x) => x + 1)
      })
  }, [])


  return editor 

}