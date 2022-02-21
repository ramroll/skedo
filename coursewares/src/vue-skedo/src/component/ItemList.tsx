// import Editor from '../object/Editor'
import { Actions } from '../types/editor.types'
import classes from './drag-drop.module.scss'

import metas from '../object/Metas'
import { Editor } from '../object/Editor'


// type EditorProps = {
// 	editor : Editor 
// }

type Unwrapped<T> = T extends (infer U)[] ? U : T
export default ({editor} : {editor : Editor}) => {


  return <div class={classes['item-list']}>
		{metas.map(item => {
			return (
        <div
          draggable={true}
          onDragstart={(e) => {
            console.log('onDragStart')
            editor.dispatch(Actions.StartAddComponent, item)
          }}
          // onDrop = {(e) => {
          //   e.preventDefault()
          //   console.log('drop')
          //   editor.dispatch(Actions.EvtDrop)
          // }}
          class={classes["item"]}
          key={item.type}
        >
          {item.title}
        </div>
      )
		})}
	</div>
}