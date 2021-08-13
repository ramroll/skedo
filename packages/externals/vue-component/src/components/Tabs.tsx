import {
  defineComponent,
  onMounted,
  PropType,
  ref,
} from "vue"
import classes from "./tab.module.scss"
import { Bridge } from "@skedo/meta"
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
    return () => {
      return (
        <div class={classes.tabs} style={props.style}>
          <div class={classes.panel}>
            {props.tabs.map(tab => {
              return <TabPanel bridge={props.bridge} tab={tab} />
            })}
          </div>
          <div class={classes.menu}>
            {props.tabs.map((tab) => {
              return <MenuItem tab={tab} key={tab.name} />
            })}
          </div>
        </div>
      )
    }
  },
})

const MenuItem = ({ tab }: { tab: TabData }) => {
  return (
    <div class={classes["menu-item"]}>
      <img src={tab.icon} />
      <div>{tab.title}</div>
    </div>
  )
}

const TabPanel = defineComponent({
  props : {
    tab : Object as PropType<TabData>,
    bridge : Bridge
  },
  setup(props) {
    const divRef : any = ref<HTMLElement | null>(null)

    onMounted(() => {
      const bridge = props.bridge!
      const node = bridge!.createNode({
        name : "div",
        group : "basic",
        box : {
          width:'fill',
          height : 'fill'
        }
      })
      const elem = divRef.value!
      bridge.render("dom", node, {
        ele : elem
      })
    })

    return () => {
      return (
        <div ref={divRef} />
      )
    }
  },
})
