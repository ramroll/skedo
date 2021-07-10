<template>
	<skedo-div-container :childclass="classes.tab" v-show="isActive" />
</template>

<script lang="ts">
import { computed, inject, onMounted, PropType, ref, Ref} from 'vue'
import { Tab as TabObject } from './Tabs.vue'
import classes from './tab.module.scss'
import { Bridge } from '@skedo/core'
import SkedoDivContainer from './SkedoDivContainer.vue'

export default {
  components: { SkedoDivContainer },
	props : {
		tab : {
			type : Object as PropType<TabObject> ,
			required : true
		}
	},
	setup(props : any) {

		const active : Ref<string> | undefined = inject("activeName")
		if(!active) {
			throw new Error("Parent component Tabs should render before.")
		}
		const isActive = computed(() => props.tab.name === active.value)

		return {
			isActive,
			classes
		}

	}
}
</script>