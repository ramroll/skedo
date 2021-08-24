import { useEffect, useMemo, useState } from "react";
import { CodeEditorUI, Topic } from "../object/CodeEditorUI";
export function useCodeEditor(page : string){

  const editor = useMemo(() => new CodeEditorUI(page), [])
  const [, setVer] = useState(0)

  useEffect(() => {
    editor.on([Topic.SelectionChanged, Topic.Loaded])
      .subscribe(() => {
        setVer(x => x + 1)
      })
  }, [])


  return editor 

}