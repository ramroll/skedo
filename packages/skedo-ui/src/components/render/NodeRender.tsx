import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Bridge, Node, RenderOptions, Topic } from '@skedo/meta'
import ExternalComponent from './ExternalComponent'
import { NodeRenderProps, RenderedComponentProps } from './render.types'
import Draggable from '../draggable/Draggable'
import Selectable from '../selectable/Selectable'
import RenderContext from './RenderContext'
import { UIEvents } from '../../object/UIModel'
import { useSubscribe } from '../../hooks/useSubscribe'
import getLocalComponentByURL from './getLocalComponentByURL'


function __render(node : Node, options : RenderOptions){
  const reactElement = (
    <NodeRender
      node={node}
      key={options.key}
      inheritProps={options.childrenProps}
    />
  )
  if(options.ele) {
    ReactDOM.render(reactElement, options.ele)
    return
  }
  return reactElement
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
      className={'skedo-' + node.getName()}
      {...{ "data-skedo-type": node.getName() }}
      style={{
        width: box.width.toString(),
        height: box.height.toString(),
        display: box.display,
        flexDirection: box.flexDirection,
        position: box.position,
        ...style,
        ...node.getStyleObject(),
      }}
    >
      {React.cloneElement(children, {
        ...children.props,
        onMouseDown: dragHandlers?.onMouseDown,
      })}
    </div>
  )
}

function InnerRender({node, C, inheritProps} : NodeRenderProps & {C : React.ElementType}){
  const context = useContext(RenderContext)
  const editor = context.editor!
  const bridge = new Bridge(node, editor.page, 'editor')
  bridge.renderForReact = __render
  const passProps = node.getPassProps().toJS()

  const [, setVer] = useState(0)

  useSubscribe(
    [
      [
        node,
        [
          Topic.Resized,
          Topic.NodeMoved,
          Topic.NodePropUpdated,
          Topic.NodeChildrenChanged,
        ],
      ],
    ],
    () => {
      setVer((x) => x + 1)
    }
  )
  function selectionChangeHandler(selected : boolean) {
    if(selected) {
      editor.dispatch(UIEvents.EvtSelected, node)
    } else {
      editor.dispatch(UIEvents.EvtCancelSelect, node)
    }
  }

  const box = node.getBox() 
  return (
    <Draggable
      style={inheritProps?.style}
      enabled={node.isDraggable()}
      initialPosition={[box.left.toString(), box.top.toString()]}
      onDrag={e => {
        if(node.isDraggable()) {
          editor.dispatch(UIEvents.EvtNodeSyncMoving, node, [e.diffX, e.diffY])
        }
      }}
      onDragEnd={e => {
        if(node.isDraggable()) {
          editor.dispatch(UIEvents.EvtNodeMoved, node, [e.diffX, e.diffY])
        }
      }}
    >
      <Styled
        node={node}
      >
        <Selectable
          onSelectChanged={selectionChangeHandler}
          node={node}
        >
          <C bridge={bridge} {...passProps} />
        </Selectable>
      </Styled>
    </Draggable>
  )


} 

const NodeRender = ({node, inheritProps } : NodeRenderProps) => {

  if(node.meta.url) {
    const localComponent = getLocalComponentByURL(node.meta.url)
    if(localComponent) {
      return <InnerRender inheritProps={inheritProps} C={localComponent} node={node}  />
    }

    const C = (props: RenderedComponentProps) => (
      <ExternalComponent
        node={node}
        url={node.meta.url!}
        bridge={props.bridge}
      />
    )
    return <InnerRender C={C} node={node} inheritProps={inheritProps} />
  }
  throw new Error(`Component ${node.getGroup() + "." + node.getName()} not found.`)
}

export default NodeRender