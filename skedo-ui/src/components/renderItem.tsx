import { NodeType as Node } from '@skedo/core'
import {Bridge} from '@skedo/core'
import ComponentTreeNode from './ComponentTreeNode'
import ComponentsLoader from '../object/ComponentsLoader'
import NodeStyleHelper from './NodeStyleHelper'
import ExternalComponent from './ExternalComponent'
import EditorModel from '../object/EditorModel'
import { useMemo } from 'react'

function renderDIV(node : Node, editor : EditorModel) {
  return node.getChildren().map((child) => {
    return (
      <ComponentTreeNode
        editor={editor}
        key={child.getId()}
        node={child}
      />
    )
  })
}



function renderFlexDiv(node : Node, editor : EditorModel) {
  if(!node.getReceiving()) {
    return renderDIV(node, editor)
  }

  const children = node.getChildren() as Array<Node>
  children.push(node.getReceiving() as Node)

  const receiving = node.getReceiving()!
  const absRect = receiving.absRect()
  const absContainerRect = node.absRect() 
  const left = absRect.left - absContainerRect.left 
  const top = absRect.top - absContainerRect.top

  if (node.getStyle("flexDirection") === "column") {
    children.sort((a, b) => {
      const topA =
        a === receiving ? top : a.getRect().top
      const topB =
        b === receiving ? top: b.getRect().top
      return topA - topB
    })
  } else {
    children.sort((a, b) => {
      const leftA =
        a === receiving ? left : a.getRect().left
      const leftB =
        b === receiving ? left : b.getRect().left
      return leftA - leftB
    })
  }

  const style = NodeStyleHelper.basicStyle(receiving, node)
  style.background = `rgba(0,0,0,.4)`
  return children.map((child) => {
    if(child === receiving) {
      return <div style={style}></div>
    }
    else return (
      <ComponentTreeNode
        editor={editor}
        key={child.getId()}
        node={child}
      />
    )
  })
}


function renderLocalComponent(node : Node, editor : EditorModel, C :React.FC<any> | React.ComponentClass ) {
  const bridge = new Bridge(node, editor.page)
  return <C key={node.getId()} bridge={bridge}  {...node.getPassProps().toJS()} />
}

function renderExternalComponent(node : Node, editor : EditorModel) {
  const bridge = Bridge.of(node, editor.page)
  if(!node.meta.url) {
    return null
  }
  return (
    <ExternalComponent
      node={node}
      url={node.meta.url}
      bridge={bridge}
    />
  )
}

function renderItem(node : Node, editor : EditorModel) {
  if(node.isContainer()) {
    if(node.isFlex()) {
      return renderFlexDiv(node, editor)
    }
    return renderDIV(node, editor)
  }

  if(node.meta.url) {

    const localComponent = ComponentsLoader.getLocalComponentByURL(node.meta.url)
    if(localComponent) {
      return renderLocalComponent(node, editor, localComponent)
    }
    return renderExternalComponent(node, editor)
  }

  return null

}

export default renderItem