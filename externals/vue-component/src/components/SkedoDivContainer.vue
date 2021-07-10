<template>
	<div :class="childclass" style="width : 100%; height :100%;" ref="nodeRef">
	</div>
</template>

<script lang="ts">
import {  inject, onMounted, ref } from 'vue'
import { Bridge } from '@skedo/core'

export default {
	props : {
		childclass : {
			type : Object,
		}
	},
	setup(props : any) {
		const bridge : Bridge | undefined = inject("bridge") 
		const elm = ref<HTMLElement | null>(null)
		let selfBridge : Bridge | null = null
		if(!bridge) {
			throw new Error("Parent component Tabs should render before.")
		}

		onMounted(() => {
			const elem = elm.value
			if(elem && selfBridge) {
				selfBridge.renderExternal(elem)
			}
		})

		selfBridge = bridge.createChildBridge({
			name : "div",
			group : "basic",
			type : '',
			box : {
				width : '100%', 
				height : '100%',
				mode : 'fill'
			},
			style : {
				flex : 1
			},
			children : []
		})


		return {
			nodeRef : elm ,
			childclass : props.childclass 
		}

	}
}
</script>