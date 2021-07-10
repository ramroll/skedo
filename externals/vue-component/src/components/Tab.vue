<template>
	<div :class="classes.tab" v-show="isActive" ref="nodeRef">
	</div>
</template>

<script lang="ts">
import { computed, inject, onMounted, PropType, ref, Ref} from 'vue'
import { Tab as TabObject } from './Tabs.vue'
import classes from './tab.module.scss'
import { Bridge } from '@skedo/core'

export default {
	props : {
		tab : {
			type : Object as PropType<TabObject> ,
			required : true
		}
	},
	setup(props : any) {

		const active : Ref<string> | undefined = inject("activeName")
		const bridge : Bridge | undefined = inject("bridge") 
		const elm = ref<HTMLElement | null>(null)
		let selfBridge : Bridge | null = null
		if(!active || !bridge) {
			throw new Error("Parent component Tabs should render before.")
		}

		onMounted(() => {
			const elem = elm.value
			if(elem && selfBridge) {
				selfBridge.renderExternal(elem)
			}
		})


		selfBridge = bridge.createChildBridge({
			type : "div",
			group : "basic",
			rect : [0,0,0,0],
			mode : "fill",
			style : {
				flex : 1
			}
		})

		const isActive = computed(() => props.tab.name === active.value)

		return {
			isActive,
			classes,
			nodeRef : elm 
		}

	}
}
</script>