<template>
	<div :class="classes.card">
		<SkedoDivContainer  />	
	</div>
</template>

<script lang='ts'>
import classes from './card.module.scss'
import SkedoDivContainer from './SkedoDivContainer.vue'

export default {
	components : {
		SkedoDivContainer
	},
	setup(){
		return {
			classes 
		}
	}
}
</script>