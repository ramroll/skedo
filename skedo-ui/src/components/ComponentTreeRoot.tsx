import  { useEffect,  RefObject } from 'react';
import Node from '../object/Node'
import styles from '../style/core.module.scss'
import useBound from '../hooks/useBound'
import ComponentTreeNode from './ComponentTreeNode'
import EditorModel from '../object/EditorModel';


type ComponentTreeProps = {
  level? : number,
  style ? : any,
  node : Node,
  editor : EditorModel,
  rootRef? : RefObject<HTMLDivElement>
}


export const ComponentTreeRoot = ({style, editor} : ComponentTreeProps) => {
  const page = editor.page
  const [container, containerEl] = useBound()
  // const [dragNode, setDragNode] = useState<Node | null>(null)

  useEffect(() => {
    
    const scroller = containerEl.current
    setTimeout(() => {
      editor.cord.initScroll()
      scroller?.scrollTo(editor.cord.scrollX, editor.cord.scrollY)
    }, 100)
  }, [ page, containerEl])

  useEffect(() => {
    editor.cord.setViewPort(container)
  }, [container, page])

  useEffect(() => {
    window.addEventListener("mouseup", editor.onMouseUp)
    return () => {
      window.removeEventListener("mouseup", editor.onMouseUp)
    }
  }, [window, editor])


  return (
    <div
      style={style}
      ref={containerEl as RefObject<HTMLDivElement>}
      className={styles["root-w"]}
      onDragOver={e => {
        e.preventDefault()
        e.stopPropagation()
        editor.onDragOver(e.clientX, e.clientY)
      }}
      onDrop={e => {
        editor.onDragDrop()
      }}
      onMouseDown={editor.onMouseDown}
      onMouseMove={editor.onMouseMove}
      onClickCapture={editor.onClickCapture}
      onScroll={editor.onScroll}
    >

      {page.root && (
        <ComponentTreeNode
          node={editor.page.root}
          editor={editor}
        />
      )}
    </div>
  )

}

export default ComponentTreeRoot