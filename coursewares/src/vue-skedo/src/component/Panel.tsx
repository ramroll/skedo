import { Editor } from "../object/Editor"
import { Render } from "./Render"
import classes from './drag-drop.module.scss'
import { Actions } from "../types/editor.types"

export const Panel = ({editor} : {
  editor : Editor
}) => {
  return (
    <div
      class={classes.panel}
      onDragover={(e) => {
        e.preventDefault()
        editor.dispatch(Actions.EvtDrag, [
          e.clientX,
          e.clientY,
        ])
      }}
      onDrop={(e) => {
        e.preventDefault()
        editor.dispatch(Actions.EvtDrop)
      }}
    >
      <Render node={editor.getRoot()} />
    </div>
  )
}