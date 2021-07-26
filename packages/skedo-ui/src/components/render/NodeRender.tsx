import React, { useContext, useEffect, useRef, useState } from 'react'
import { Bridge, CordNew, Node, sizeUnitToNumber, sizeUnitToString, Topic } from '@skedo/core'
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
  style,
  draggable = false,
  dragHandlers,
}: {
  node : Node,
  children: JSX.Element,
  style? : any ,
  draggable ? : boolean,
  dragHandlers? : any,
}) {
  const box = node.getBox()
  const ref = useRef<HTMLDivElement>(null)
  const context = useContext(RenderContext)

  useEffect(() => {
    node.mount(ref.current!, context.cord)
  },[])

  useSubscribe([node, Topic.MouseMoveEventPass], (e : MouseEvent) => {
    dragHandlers&& dragHandlers.onMouseMove && dragHandlers.onMouseMove(e)
  })

  useSubscribe([node, Topic.MouseUpEventPass], (e : MouseEvent) => {
    dragHandlers&& dragHandlers.onMouseUp && dragHandlers.onMouseUp(e)
  })



  

  return (
    <div
      ref={ref}
      draggable={draggable}
      style={{
        left: sizeUnitToString(box.left),
        top: sizeUnitToString(box.top),
        width: sizeUnitToString(box.width),
        height: sizeUnitToString(box.height),
        ...style,
        ...node.getStyleObject(),
      }}
    >
      {React.cloneElement(children, {
        ...children.props, 
        onMouseDown : dragHandlers?.onMouseDown,
      })}
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

  useSubscribe([[editor, Topic.SelectionChanged], [node, Topic.NodeMoved]], () => {
    setVer(x => x + 1)
  })
  function selectionChangeHandler(selected : boolean) {
    if(selected) {
      editor.dispatch(UIEvents.EvtSelected, node)
    } else {
      editor.dispatch(UIEvents.EvtCancelSelect, node)
    }
  }

  const box = node.getBox() 
  console.log(box, node.getName())
  return (
    <Draggable
      enabled={node.isDraggable()}
      initialPosition={[box.left.value + box.left.unit, box.top.value + box.top.unit]}
      onDrag={e => {
        editor.dispatch(UIEvents.EvtNodeSyncMoving, node, [e.diffX, e.diffY])
      }}
      onDragEnd={e => {
        editor.dispatch(UIEvents.EvtNodeMoved, node, [e.diffX, e.diffY])
      }}
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