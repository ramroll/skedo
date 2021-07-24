import { ItemRender } from 'antd/lib/upload/interface'
import React, { FC } from 'react'
import { Bridge } from '@skedo/core'
import ComponentsLoader from '../../object/ComponentsLoader'
import ExternalComponent from './ExternalComponent'
import { NodeRenderProps, RenderedComponentProps } from './render.types'
import Draggable from '../draggable/Draggable'



function InnerRender({node, C, editor} : NodeRenderProps & {C : React.ElementType}){
  const bridge = new Bridge(node, editor.page)
  if(node.isDraggable()) {
    const box = node.getBox()
    return <Draggable initialPosition={[box.left.value, box.top.value]}>
     <C bridge={bridge} />
    </Draggable>
  }

  return <C bridge={bridge} />
} 

const NodeRender = ({node,editor } : NodeRenderProps) => {

  if(node.meta.url) {
    const localComponent = ComponentsLoader.getLocalComponentByURL(node.meta.url)
    if(localComponent) {
      return <InnerRender C={localComponent} node={node} editor={editor} />
    }

    const C = (props: RenderedComponentProps) => (
      <ExternalComponent
        node={node}
        url={node.meta.url!}
        bridge={props.bridge}
      />
    )
    return <InnerRender C={C} node={node} editor={editor} />
  }
	return null
}

export default NodeRender