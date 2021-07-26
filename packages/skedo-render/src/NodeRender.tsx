import React, { useContext, useEffect, useRef } from 'react'
import { Bridge, Node, sizeUnitToString, NodeRenderProps, RenderedComponentProps } from '@skedo/core'
import ExternalComponent from './ExternalComponent'
import RenderContext from './RenderContext'
import getLocalComponentByURL from './getLocalComponentByURL'

function __render(node : Node, key ? : any){
  return <NodeRender node={node} key={key} />
}

function Styled({
  node,
  children,
  style,
}: {
  node : Node,
  children: JSX.Element,
  style? : any ,
}) {
  const box = node.getBox()
  const ref = useRef<HTMLDivElement>(null)
  const context = useContext(RenderContext)

  useEffect(() => {
    node.mount(ref.current!, context.cord)
  },[])


  return (
    <div
      ref={ref}
      style={{
        left : sizeUnitToString(box.left),
        top : sizeUnitToString(box.top),
        width: sizeUnitToString(box.width),
        height: sizeUnitToString(box.height),
        ...style,
        ...node.getStyleObject(),
      }}
    >
      {React.cloneElement(children, {
        ...children.props, 
      })}
    </div>
  )
}

function InnerRender({node, C} : NodeRenderProps & {C : React.ElementType}){
  const bridge = new Bridge(node)
  bridge.renderForReact = __render
  const passProps = node.getPassProps().toJS()


  const box = node.getBox() 
  return (
      <Styled
        node={node}
        style={{ position: "absolute" }}
      >
        <C bridge={bridge} {...passProps} />
      </Styled>
  )


} 

export const NodeRender = ({ node }: NodeRenderProps) => {
  if(node.getName() === 'root') {
    node = node.getChildren()[0]
    node.setXY(0, 0)
  }
  
  if (node.meta.url) {
    const localComponent = getLocalComponentByURL(
      node.meta.url
    )
    if (localComponent) {
      return <InnerRender C={localComponent} node={node} />
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
  throw new Error(
    `Component ${
      node.getGroup() + "." + node.getName()
    } not found.`
  )
}
