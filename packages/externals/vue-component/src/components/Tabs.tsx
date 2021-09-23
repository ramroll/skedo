import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  Ref,
  watch
} from "vue"
import classes from "./tab.module.scss"
import { Bridge, Node } from "@skedo/meta"
import { TabData } from "./TabData"

export default defineComponent({
  props: {
    bridge: Bridge,
    style: Object
  },
  setup(props) {

    const bridge = props.bridge!
    const childrens = bridge.getNode().getChildren()  || []

    function getTabs(){
      return bridge.passProps().tabs as Array<TabData>
    }
    const tabs = getTabs()
    const active = ref(tabs[0].name)

    return () => {
      console.log(getTabs())
      return (
        <div class={classes.tabs} style={props.style}>
          <div class={classes.panel}>
            {getTabs().map( (tab, i) => {
              return (
                <TabPanel
                  active={active}
                  bridge={props.bridge}
                  node={childrens[i]}
                  tab={tab}
                />
              )
            })}
          </div>
          <div class={classes.menu}>
            {getTabs().map((tab) => {
              return <MenuItem onClick={() => {
                active.value = tab.name
              }} tab={tab} key={tab.name} />
            })}
          </div>
        </div>
      )
    }
  },
})

const MenuItem = ({ tab, onClick }: { tab: TabData, onClick  : () => void }) => {
  return (
    <div onClick={onClick} class={classes["menu-item"]}>
      <img src={tab.icon} />
      <div>{tab.title}</div>
    </div>
  )
}

const TabPanel = defineComponent({
  props : {
    tab : Object as PropType<TabData>,
    bridge : Bridge,
    node : Node,
    active : Object as PropType<Ref<string>>
  },
  setup(props) {
    const divRef : any = ref<HTMLElement | null>(null)
    const bridge = props.bridge!

    let node : Node
    if(props.node) {
      console.log('use exists node')
      node = props.node
    } else {
      node = bridge!.createExternalNode({
          name: "div",
          group: "container",
          box: {
            movable: false,
            resizable: false,
            top : 0,
            left : 0,
            width: "fill",
            height: "fill",
          },
        })
      console.log('add child')
      bridge.addChild(node)
    }

    

    watch(divRef, () => {
      if(divRef.value) {
        const elem = divRef.value!
        bridge.render("dom", node, {
          ele : elem
        })
      }
    }) 

    return () => {
      if(props.tab!.name !== props.active!.value) {
        return null
      }
      return (
        <div class={classes.tab} ref={divRef} />
      )
    }
  },
})
