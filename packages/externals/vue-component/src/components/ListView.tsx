import { Bridge, LinkedNode, Node, Topic } from "@skedo/meta"
import { defineComponent, ref, watch } from "vue"
import classes from './listview.module.scss'

export default defineComponent({
  props : {
    bridge : {
      type : Bridge,
    },
  },
  setup(props){
    const passProps = props.bridge!.passProps() 
    const templateNumber = passProps.templateNumber
    const replicaNumber = passProps.replicaNumber


    const tempaltes = [...Array(templateNumber)].map(() => props.bridge!.createExternalNode({
      name : "div",
      group : 'basic',
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
    }))


    const parent = props.bridge?.getNode()
    const nodes : LinkedNode[] = []

    if(props.bridge?.getMode() === 'editor') {
      for(let i = 0 ; i < tempaltes.length; i++) {
        for (let j = 0; j < replicaNumber; j++) {
          let node = parent?.getChildren()[replicaNumber * i + j] as LinkedNode
          if(!node) {
            node = props.bridge!.createLinkNode(tempaltes[i])
            nodes.push(node)
            parent?.addToRelative(node)
            node.getBox().top.setMode('auto')
          } else {
            nodes.push(node)
          }
        }
      }
    } 


    const bridge = props.bridge!

    const v = ref(0)
    bridge.on(Topic.MemorizedDataChanged)
      .subscribe(() => {
        v.value++
        console.log('list-view', "MemorizedDataChanged")
      })
    

    return () => {

      console.log(v.value)
      if(bridge?.getMode() === 'editor') {
        return <div class={classes.listview}>
          {nodes.map( node => {
            return (
              <NodeRender
                node={node}
                bridge={props.bridge}
                key={node.getId()}
              />
            )
          })}
        </div>
      } else {
        const list = bridge.getMemorizedData()
        console.log("not render mode...", list, bridge)
        if(!list) {
          return null
        }

        return <div key={v.value} class={classes.listview}>
          {list.map( (rowData, i) => {
            const node = props.bridge!.createLinkNode(
              // @ts-ignore
              bridge.getNode().getChildren()[0].node
            )
            node.memory(rowData)
            bridge.addChild(node)
            console.log('node', node)
            return (
              <NodeRender
                node={node}
                bridge={props.bridge}
                key={i}
              />
            )
          })}
        </div>


      }


    }
  }
})

const NodeRender = defineComponent({
  props : {
    node : Node,
    bridge : Bridge
  },
  setup (props) {
    const divRef = ref<HTMLElement | null>(null)

    watch(divRef, () => {
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