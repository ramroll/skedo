import Editor from '../object/Editor'
import { Actions } from '../types/editor.types'
import classes from './drag-drop.module.scss'

import metas from '../object/Metas'


type EditorProps = {
	editor : Editor 
}

type Unwrapped<T> = T extends (infer U)[] ? U : T
export default (props : EditorProps) => {

	function handleDragStart(e : DragEvent, meta : Unwrapped<typeof metas>){
		props.editor.dispatch(Actions.StartAddComponent, meta)
	}

  return <div class={classes['item-list']}>
		{metas.map(item => {
			return (
        <div
          draggable={true}
          onDragstart={(e) => handleDragStart(e, item)}
          class={classes["item"]}
          key={item.type}
        >
          {item.title}
        </div>
      )
		})}
	</div>
}