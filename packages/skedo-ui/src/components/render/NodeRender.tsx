import React, { useContext, useEffect, useState } from 'react'
import { Bridge, Node, sizeUnitToString, Topic } from '@skedo/core'
import ComponentsLoader from '../../object/ComponentsLoader'
import ExternalComponent from './ExternalComponent'
import { NodeRenderProps, RenderedComponentProps } from './render.types'
import Draggable from '../draggable/Draggable'
import Selectable from '../selectable/Selectable'
import RenderContext from './RenderContext'
import { UIEvents } from '../../object/EditorModel'
import { useSubscribe } from '../../hooks/useSubscribe'

function __render(node : Node, key ? : any){
  return <NodeRender node={node} key={key} />
}

function Styled({
  node,
  children,
  style
}: {
  node : Node,
  children: JSX.Element,
  style? : any 
}) {
  const box = node.getBox()

  return (
    <div
      style={{
        left: sizeUnitToString(box.left),
        top: sizeUnitToString(box.top),
        width: sizeUnitToString(box.width),
        height: sizeUnitToString(box.height),
        ...style,
        ...node.getStyleObject()
      }}
    >
      {children}
    </div>
  )
}

function InnerRender({node, C} : NodeRenderProps & {C : React.ElementType}){
  const bridge = new Bridge(node)
  bridge.renderForReact = __render
  const passProps = node.getPassProps().toJS()
  const context = useContext(RenderContext)
  const editor = context.editor!

  const [ver, setVer] = useState(0)


  useSubscribe(editor, Topic.SelectionChanged, () => {
    setVer(x => x + 1)
  })

  function selectionChangeHandler(selected : boolean) {
    if(selected) {
      editor.dispatch(UIEvents.EvtSelected, node)
    } else {
      editor.dispatch(UIEvents.EvtCancelSelect, node)
    }
  }
  if(node.isDraggable()) {
    const box = node.getBox()
    return (
      <Draggable
        initialPosition={[box.left.value, box.top.value]}
      >
        <Styled
          node={node}
          style={{ position: "absolute" }}
        >
          <Selectable
            selected={editor.selection.contains(node)}
            onSelectChanged={selectionChangeHandler}
          >
            <C bridge={bridge} {...passProps} />
          </Selectable>
        </Styled>
      </Draggable>
    )
  }

  return (
    <Styled node={node} style={{ position: "relative" }}>
      <Selectable
        onSelectChanged={selectionChangeHandler}
        selected={editor.selection.contains(node)}
      >
        <C bridge={bridge} {...passProps} />
      </Selectable>
    </Styled>
  )
} 

const NodeRender = ({node } : NodeRenderProps) => {

  if(node.meta.url) {
    const localComponent = ComponentsLoader.getLocalComponentByURL(node.meta.url)
    if(localComponent) {
      return <InnerRender C={localComponent} node={node}  />
    }

    const C = (props: RenderedComponentProps) => (
      <ExternalComponent
        node={node}
        url={node.meta.url!}
        bridge={props.bridge}
      />
    )
    return <InnerRender C={C} node={node} />
  }
  throw new Error(`Component ${node.getGroup() + "." + node.getName()} not found.`)
}

export default NodeRender