import React from 'react'
import { Bridge, Node, sizeUnitToString } from '@skedo/core'
import ComponentsLoader from '../../object/ComponentsLoader'
import ExternalComponent from './ExternalComponent'
import { NodeRenderProps, RenderedComponentProps } from './render.types'
import Draggable from '../draggable/Draggable'

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
  if(node.isDraggable()) {
    const box = node.getBox()
    return <Draggable initialPosition={[box.left.value, box.top.value]}>
      <Styled node={node} style={{position : 'absolute'}}>
        <C bridge={bridge} {...passProps} />
      </Styled>
    </Draggable>
  }

  return (
    <Styled node={node} style={{position : "relative"}}>
      <C bridge={bridge} {...passProps} />
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