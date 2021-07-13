<template>
	<div :class="classes.tabs" :style="style">
		<div :class="classes.panel">
			<Tab v-for="tab in tabs" :key="tab.name" :tab="tab"  />	
		</div>
		<div :class="classes.menu">
			<div :class="classes['menu-item']" v-for="tab in tabs" :key="tab.name" @click="select(tab.name)">
				<img :src="tab.icon" />
				<div>{{ tab.title }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType, provide, reactive, toRefs } from 'vue'
import classes from "./tab.module.scss"
import Tab from "./Tab.vue"
import { Bridge } from '@skedo/core'
import { TabData } from './TabData'


export type TabsState = {
	active : string,
	tabs : Array<TabData>,
}
export default {
	props : {
		style : {
			type : Object
		},
		bridge : {
			type : Bridge as PropType<Bridge>,
			required : false 
		},
		tabs : {
			type : Array as PropType<Array<TabData>>,
			default : [
				{
					name : "home",
					title : "首页",
					icon : "https://voice-static.oss-accelerate.aliyuncs.com/img/0ad95d3784e75a6aaeaaaef718cfa4da03be0b48.png"
				},
        {
          name : 'descover',
          title : "发现",
          icon : 'https://voice-static.oss-accelerate.aliyuncs.com/img/ca6ab328733e5db1f6c7ff4101388c78dff25040.png'
        },
        {
          name : 'test2',
          title : "我的",
          icon : 'https://voice-static.oss-accelerate.aliyuncs.com/img/3dec8e25d1121fca1e57c007a70cba131f9ccd9d.png'
        }
      ]
			
		}
	},
	components : {
		Tab
	},
	setup(props) {
		
		const state = reactive<TabsState>({
			active : props.tabs.length > 0  ? props.tabs[0].name : '',
			tabs : props.tabs 
		})

		const {active, tabs} = toRefs(state)
		provide('activeName', active)
		provide('tabs', tabs)
		provide("bridge", props.bridge || Bridge.getMockBridge())
		console.log('setup tabs.vue, props is ', props)

		const select = (name : string) => {
			console.log(name)
			active.value = name	
		}

		return {
			active,
			classes,
			tabs,
			style :props.style,
			select
		}
	}
}
</script>