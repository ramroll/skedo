import Node from '../object/Node'
import {Bridge} from '@skedo/core'
import ComponentTreeNode from './ComponentTreeNode'
import ComponentsLoader from '../object/ComponentsLoader'
import NodeStyleHelper from './NodeStyleHelper'
import ExternalComponent from './ExternalComponent'
import EditorModel from '../object/EditorModel'

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
  if(!node.receiving) {
    return renderDIV(node, editor)
  }

  const children = node.getChildren()
  children.forEach(child => {
    console.log(child.getRect().left)
  })
  children.push(node.receiving)

  const absRect = node.receiving.absRect()
  const absContainerRect = node.absRect() 
  const left = absRect.left - absContainerRect.left 
  const top = absRect.top - absContainerRect.top

  if (node.getStyle("flexDirection") === "column") {
    children.sort((a, b) => {
      const topA =
        a === node.receiving ? top : a.getRect().top
      const topB =
        b === node.receiving ? top: b.getRect().top
      return topA - topB
    })
  } else {
    children.sort((a, b) => {
      const leftA =
        a === node.receiving ? left : a.getRect().left
      const leftB =
        b === node.receiving ? left : b.getRect().left
      return leftA - leftB
    })
  }

  const style = NodeStyleHelper.basicStyle(node.receiving, node)
  style.background = `rgba(0,0,0,.4)`
  console.log(style)
  return children.map((child) => {
    if(child === node.receiving) {
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
  const bridge = new Bridge(node, editor.page)
  if(!node.meta.url) {
    return null
  }
  return (
    <ExternalComponent
      componentType={node.meta.componentType}
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