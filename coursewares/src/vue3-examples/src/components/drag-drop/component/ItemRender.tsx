import { ref } from "vue"
import { lexicalCache, lexicalScope } from "@skedo/vue-lexical-cache"
import Editor from "../object/Editor"
import { EditorEvents } from "../object/EditorEvents"
import Node from '../object/Node'
import { Actions } from "../types/editor.types"
import Draggable from "./Draggable"

lexicalScoped('ref')
type ItemRenderProps = {
	node : Node,
	editor : Editor,
	style ? : any
}

const ItemRenderForDraggable = (props: ItemRenderProps) => {
  const { node, editor, style, ...others } = props
	const ver = ref(0)

	lexicalCache(() => {
		node.on(EditorEvents.NodePositionUpdated)
			.subscribe(() => {
				ver.value++
			})

	}, [])

	function render(ver : number) {
    switch (props.node.getType()) {
      case "image":
        return (
          <img
            {...others}
            src={"https://img.kaikeba.com/a/83541110301202sxpe.png"}
            style={{
              ...style,
            }}
          />
        )
      case "rect":
        return (
          <div
            {...others}
            style={{
              backgroundColor: "yellow",
              ...style,
            }}
          />
        )
      case "text":
        return (
          <h2 {...others} style={{ ...style }}>
            这里是文本
          </h2>
        )
    }
  }

	return <Draggable initialPosition={[node.getX(), node.getY()]}
		onDragStart={(dragNode) => {
			editor.dispatch(Actions.EvtDragStart, node)
		}}
		onDrag={() => {
			editor.dispatch(Actions.EvtDrag)
		}}
		onDragEnd={(dragNode) => {
			editor.dispatch(Actions.EvtDragEnd, [dragNode.diffX, dragNode.diffY])
		}}
	>
		{render(ver.value)}
	</Draggable>
}


export const ItemRender = ({node, editor}: ItemRenderProps) => {
	console.log('item-render.render', node)

	const ver = ref(0)

	lexicalCache(() => {
		node.on(EditorEvents.NodeChildrenUpdated)
			.subscribe(() => {
				ver.value++
			})


	},[])
	switch(node.getType()) {
		case 'root':
			const children = node.getChildren()
			return <div key={ver.value}>
					{children.map( (node : Node, i : number) => {
						console.log('render-children')
						return (
              <ItemRender
								style={{
									width : node.getW() + 'px',
									height : node.getH() + 'px'
								}}
                node={node}
                key={i}
                editor={editor}
              />
            )
					})}
				</div>
		case "rect":
		case "image":
  	case "text":
			return <ItemRenderForDraggable editor={editor} node={node} />
		default:
			throw new Error("unsupported type:"+ node.getType())
	}

	
}