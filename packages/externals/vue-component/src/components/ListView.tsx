import { Bridge, LinkedNode, Node } from "@skedo/meta"
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
      name : "row",
      group : 'basic',
      box : {
        movable : false,
        resizable : false,
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
          if(!parent?.getChildren()[replicaNumber * i + j]) {
            const node = props.bridge!.createLinkNode(tempaltes[i])
            nodes.push(node)
            parent?.addToRelative(node)
            node.getBox().top.setMode('auto')
          }
        }
      }
    }

    return () => {

      return <div class={classes.listview}>
        {nodes.map( node => {
          return <NodeRender node={node} bridge={props.bridge} key={node.getId()} />
        })}

      </div>

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
        props.bridge!.render("dom", props.node!, {
          ele : divRef.value
        })
      }
    })
    return () => {
      return <div ref={divRef} />
    }
  }
}) 