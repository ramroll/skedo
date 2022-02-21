import { defineComponent, provide } from "vue"
import "./index.scss"
import classes from "./drag-drop.module.scss"
import ItemList from "./ItemList"
import { Editor } from "../object/Editor"
import { Panel } from "./Panel"

export default defineComponent({
  setup() {
    const editor = new Editor()
    provide("editor", editor)

    return () => {
      return (
        <div class={classes.page}>
          <ItemList editor={editor} />
          <Panel editor={editor} />
        </div>
      )
    }
  },
})
