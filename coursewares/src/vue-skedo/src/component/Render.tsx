import { defineComponent, ref, inject, VNode } from 'vue'
import { Editor } from '../object/Editor'
import {Node} from '../object/Node'
import { Topics } from '../object/Topics'
import { Actions } from '../types/editor.types'
import { Draggable } from './Draggable'
// <Render node={node} />

// div | image | text | root

function render(node : Node) {

  switch(node.getType()) {
    case "root" :
      return <Root node={node} />
    case "text":
    case "rect":
    case "image":
      return <ItemRenderForDraggable node={node} />
    default:
      throw new Error(`unsupported node type:${node.getType()}`)
  }
}

type SkedoComponent = {
  node : Node
}


function renderItem(node: Node) {
  switch (node.getType()) {
    case "image":
      return (
        <img
          src={
            "https://img.kaikeba.com/a/83541110301202sxpe.png"
          }
        />
      )
    case "rect":
      return (
        <div
          style={{
            backgroundColor: "yellow",
          }}
        />
      )
    case "text":
      return <h2>这里是文本</h2>
  }
}
const ItemRenderForDraggable = ({node} : SkedoComponent) => {

  const editor = inject('editor') as Editor
  return (
    <Draggable
      initialPosition={[node.getX(), node.getY()]}
      onDragstart={() => {
        editor.dispatch(Actions.EvtDragStart, node)
      }}
      onDragend={(vec) => {
        editor.dispatch(Actions.EvtDragEnd, vec)
      }}
    >
      {renderItem(node)}
    </Draggable>
  )
}

const Root = ({node} : SkedoComponent) => {
  const children = node.getChildren()
  return <div data-skedo='root'>
    {children.map( (node, i) => {
      return <Render key={i} node={node} />
    })}
  </div>

}


export const Render = defineComponent({
  props : {
    node : {
      type : Node,
      required : true
    }
  },
  setup({node}){
    const ver = ref(0)
    node.on([Topics.NodeChildrenUpdated, Topics.NodePositionMoved])
      .subscribe(() => {
        ver.value ++
      })

    return () => {
      return <Dummy key={ver.value} render={() => render(node)} />
    }
  }
})

function Dummy({render} : {render : () => JSX.Element}){
  return render()
}
// export const Render = ({node} : SkedoComponent) => {
//   return render(node)
// }