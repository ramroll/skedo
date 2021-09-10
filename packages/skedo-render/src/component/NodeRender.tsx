import ReactDOM from 'react-dom'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Bridge, Node,  NodeRenderProps, RenderedComponentProps, RenderOptions, Topic } from '@skedo/meta'
import ExternalComponent from './ExternalComponent'
import { RenderContext } from './RenderContext'
import getLocalComponentByURL from '../getLocalComponentByURL'
import classes from './render.module.scss'

function __render(node : Node, options : RenderOptions){
  const reactElement = (
    <NodeRender
      node={node}
      key={options.key}
      inheritProps={options.childrenProps}
    />
  )
  if(options.ele)  {
    ReactDOM.render(reactElement, options.ele)
    return null
  }
  return reactElement
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
      className={classes['skedo-' + node.getName()]}
      style={{
        left : box.left.toString(),
        top : box.top.toString(),
        width: box.width.toString(),
        height: box.height.toString(),
        overflow : "hidden",
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

function InnerRender({node, C, inheritProps} : NodeRenderProps & {C : React.ElementType}){
  const page = useContext(RenderContext).page!
  const bridge = new Bridge(node, page, "render")
  bridge.renderForReact = __render
  const passProps = node.getPassProps().toJS()
  const [, setVer] = useState(0)

  useEffect(() => {
    node.on(Topic.MemorizedDataChanged)
      .subscribe(() => {
        console.log("event:MemorizedDataChanged")
        setVer(x => x + 1)
      })
  }, [])

  return (
      <Styled
        node={node}
        style={{ position: node.getBox().position, ...inheritProps?.style }}
      >
        <C bridge={bridge} {...passProps} />
      </Styled>
  )


} 

export const NodeRender = ({ node, inheritProps }: NodeRenderProps) => {
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
    return <InnerRender C={C} node={node} inheritProps={inheritProps} />
  }
  throw new Error(
    `Component ${
      node.getGroup() + "." + node.getName()
    } not found.`
  )
}
