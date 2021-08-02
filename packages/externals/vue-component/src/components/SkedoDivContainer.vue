<template>
	<div :class="childclass" style="width : 100%; height :100%;" ref="nodeRef">
	</div>
</template>

<script lang="ts">
import {  inject, onMounted, PropType, ref } from 'vue'
import { Bridge, Node } from '@skedo/meta'

export default {
	props : {
		childclass : {
			type : Object,
		},
		node : {
			type : Node as PropType<Node>,
			required : true
		}
	},
	setup(props : any) {
		const bridge : Bridge = inject("bridge")!
		const elm = ref<HTMLElement | null>(null)
		if(!bridge) {
			throw new Error("Parent component Tabs should render before.")
		}

		onMounted(() => {
			const elem = elm.value!
			bridge.renderExternal(props.node, elem)
		})

		return {
			nodeRef : elm ,
			childclass : props.childclass 
		}

	}
}
</script>