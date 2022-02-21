import { defineComponent, reactive, ref, toRefs } from "vue"
import "./index.scss"
import classes from './drag-drop.module.scss'
import ItemList from "./ItemList"
import Panel from "./Panel"
import Editor  from "../object/Editor"


export default defineComponent({
	setup(){

    const editor = new Editor()
  
		return () => {
      return (
        <div class={classes.page}>
          <ItemList editor={editor} />
          <Panel 
            editor={editor}
          />
        </div>
      )
    }
	}
})