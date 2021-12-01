import { Bridge, JsonNode, Node, Topic } from "@skedo/meta"
import { defineComponent, onMounted, ref, watch } from "vue"
import classes from './listview.module.scss'


function createNode() : JsonNode{
  return {
    name : "div",
    group : 'container',
    box : {
      movable : false,
      resizable : false,
      position : 'relative',
      width : {
        mode : 'fixed',
        value : 100,
        unit : '%'
      },
      height : 100,
      left : {
        mode : "fixed",
        value : 0,
        unit : 'px'
      },
    }
  } 
}
export default defineComponent({
  props : {
    bridge : {
      type : Bridge,
    },
  },
  setup(props){
    const bridge = props.bridge!


    if(bridge.getMode() === 'editor') {
      if(bridge.getNode().getChildren().length === 0) {
        const template = bridge.createExternalNode(createNode())
        bridge.addChild(template)
      }
    }

    const data = ref([])

    // SSOT
    // Single Source of Truth
    bridge.sendToCodeless("load-more")
    bridge.onDataChanged(() => {
      // const data = bridge.getMemorizedData()
      // data.value = data
      key.value ++
    })
    const key = ref(0)
    const listNode = bridge.getNode()
    const template = listNode.getChildren()[0]
    if(bridge.getMode() === "render") {
      listNode.clearChildren()
    }

    return () => {

      if(bridge.getMode() === "editor") {
        return (
          <div class={classes.listview}>
            <NodeRender
              node={bridge.getNode().getChildren()[0]}
              bridge={bridge}
            />
          </div>
        )
      }


      return (
        <ListViewRender
          key={key.value}
          bridge={bridge}
          template={template}
        />
      ) 

    }
  }
})

const ListViewRender = ({
  bridge,
  template,
}: {
  bridge: Bridge
  template: Node
}) => {
  const data = bridge.getMemorizedData()
  return (
    <div class={classes.listview}>
      {/* [{img, h1}, {img , h1}] */}
      {(data || []).map((item: any) => {
        const node = bridge.cloneNode(template)
        bridge.addChild(node)
        node.memory(item)
        return (
          <NodeRender
            key={node.getId()}
            node={node}
            bridge={bridge}
          />
        )
      })}
    </div>
  )
}

const NodeRender = defineComponent({
  props : {
    node : Node,
    bridge : Bridge
  },
  setup (props) {
    const divRef = ref<HTMLElement | null>(null)

    onMounted(() => {
      if(divRef.value) {
        console.log('render-dom')
        props.bridge!.render("dom", props.node!, {
          ele : divRef.value
        })
      }
    })

    return () => {
      return <div class={classes.tab} ref={divRef} />
    }
  }
}) 