
import { useEffect,  useState, useRef, RefObject} from 'react';
import {throttle } from 'rxjs/operators'
import {interval} from 'rxjs'
import {Topic} from '@skedo/core'
import AssistLineSVG from './AssistLineSVG';
import { NodeType } from '@skedo/core'
import SelectionFrame from './SelectionFrame'
import styles from '../style/core.module.scss'
import renderItem from './renderItem'
import EditorModel from '../object/EditorModel';
import Page from '../object/Page'



type ComponentTreeProps = {
  style ? : any,
  node : NodeType,
  editor : EditorModel,
  rootRef? : RefObject<HTMLDivElement>
}

const ComponentTreeNode = ({node, editor, rootRef} : ComponentTreeProps) => {

  const page = editor.page


  const [,setVer] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [autoResizing, setAutoResizing] = useState(false)

  useEffect(() => {
    if(ref.current) {
      node.mount(ref.current, editor.cord)
    }
  }, [node])


  useEffect(() => {
    const sub1 = node.on(Topic.Updated)
      .subscribe(() => {
        setVer(x => x + 1)
      })
    const sub2 = node.on(Topic.Moving)
      .pipe(throttle(() => interval(13)))
      .subscribe(() => {
        setVer(x => x + 1)
      })

    const sub3 = node.on(Topic.Moved)
      .subscribe(() => {
        setVer(x => x + 1)
      })
    const sub4 = node.on(Topic.EditMode)
      .subscribe(() => {
        setVer(x => x + 1)
      })
    const sub5 = node.on(Topic.ResizeModelUpdated)
      .subscribe(() => {
        setAutoResizing(true)
      })

    return () => {
      sub1 && sub1.unsubscribe()
      sub2 && sub2.unsubscribe()
      sub3 && sub3.unsubscribe()
      sub4 && sub4.unsubscribe()
      sub5 && sub5.unsubscribe()
    }
  }, [node])

  useEffect(() => {
    if(autoResizing) {
      node.autoResize()
      setTimeout(() => {
        setAutoResizing(false)
      })
    }
  }, [autoResizing])


  return (
    <div
      ref={rootRef || ref}
      className={
        node.level === 0
          ? styles["element-root"]
          : styles.element
      }
      {
        ...{
          "skedo-type" : node.getType()
        }
      }
      style={page.styleHelper.getRenderStyle(node, autoResizing)}
      key={node.getId()}
      id={"c-" + node.getId()}
    >
      <div
        className={styles["element-inner"]}
        style={page.styleHelper.getInnerStyle(node)}
      >
        {node.level === 0 && (
          <AssistLineSVG
            selection={editor.selection}
            page={page}
            scrollLeft={editor.cord.scrollX}
            scrollTop={editor.cord.scrollY}
          />
        )}

        {renderItem(node, editor)}
        <FlexShadow node={node} page={editor.page} />
      </div>
      {node.getEditMode() === false && (
        <SelectionFrame
          selection={editor.selection}
          node={node}
        />
      )}
    </div>
  )
}

interface FlexShadowProps {
  node : NodeType,
  page : Page 
}


const FlexShadow = ({node, page} : FlexShadowProps) => {
  const received = node.getReceiving()
  if(!received) {
    return null
  }
  if (received.isFlex() ) {
    return (
      <div
        style={page.styleHelper.getFlexShadowStyle(
          node,
          received
        )}
      ></div>
    )
  }

  return null

}


export default ComponentTreeNode