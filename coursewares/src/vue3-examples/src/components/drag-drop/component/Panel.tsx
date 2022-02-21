import Editor from "../object/Editor"
import { ItemRender } from "./ItemRender"
import classes from './drag-drop.module.scss'
import { Actions } from "../types/editor.types"
type PanelProps = {
	editor : Editor,
}

export default (props : PanelProps) => {
	return <div class={classes.panel} onDragover={e => {
		e.preventDefault()
		props.editor.dispatch(Actions.EvtDrag, [e.clientX, e.clientY])
	}}
	onDrop={e => {
		e.preventDefault()
		props.editor.dispatch(Actions.EvtDrop)
	}}
	>
		<ItemRender node={props.editor.getRoot()} editor={props.editor} />
	</div>

}