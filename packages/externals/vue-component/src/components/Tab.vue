<template>
	<div :class="classes.tab"  v-show="isActive" >
		<skedo-div-container :node="node"/>
	</div>
</template>

<script lang="ts">
import { computed, inject,  PropType, Ref} from 'vue'
import classes from './tab.module.scss'
import { Bridge } from '@skedo/meta'
import SkedoDivContainer from './SkedoDivContainer.vue'
import { TabData } from './TabData'

export default {
  components: { SkedoDivContainer },
	props : {
		tab : {
			type : Object as PropType<TabData> ,
			required : true
		}
	},
	setup(props : any) {

		const active : Ref<string> | undefined = inject("activeName")
		const bridge : Bridge = inject("bridge")!
		if(!active) {
			throw new Error("Parent component Tabs should render before.")
		}
		const isActive = computed(() => props.tab.name === active.value)

		const node = bridge.createNode({
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

		bridge.addChild(node)

		return {
			isActive,
			classes,
			node
		}

	}
}
</script>