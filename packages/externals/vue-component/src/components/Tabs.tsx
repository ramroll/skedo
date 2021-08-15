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
    style: Object,
    tabs: {
      type: Array as PropType<Array<TabData>>,
      default: [
        {
          name: "home",
          title: "首页",
          icon: "https://voice-static.oss-accelerate.aliyuncs.com/img/0ad95d3784e75a6aaeaaaef718cfa4da03be0b48.png",
        },
        {
          name: "descover",
          title: "发现",
          icon: "https://voice-static.oss-accelerate.aliyuncs.com/img/ca6ab328733e5db1f6c7ff4101388c78dff25040.png",
        },
        {
          name: "test2",
          title: "我的",
          icon: "https://voice-static.oss-accelerate.aliyuncs.com/img/3dec8e25d1121fca1e57c007a70cba131f9ccd9d.png",
        },
      ],
    },
  },
  setup(props) {

    const childrens = props.bridge?.getNode().getChildren()  || []

    const active = ref(props.tabs[0].name)
    console.log('setup', active.value)

    return () => {
      return (
        <div class={classes.tabs} style={props.style}>
          <div class={classes.panel}>
            {props.tabs.map( (tab, i) => {
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
            {props.tabs.map((tab) => {
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
      node = props.node
    } else {
      node = bridge!.createExternalNode({
          name: "div",
          group: "basic",
          box: {
            movable: false,
            resizable: false,
            top : 0,
            left : 0,
            width: "fill",
            height: "fill",
          },
        })
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
