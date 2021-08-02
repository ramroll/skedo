<template>
	<div :class="classes.scroller">
		<card v-for="item in list" :key="item.key" />
	</div>
</template>

<script lang='ts'>
import { reactive, toRef, provide} from 'vue'
import Card from './Card.vue'
import classes from './card.module.scss'
import { Bridge } from '@skedo/meta'
export default {
  components: { Card },
	props : {
		fetchFN : {
			type : Function,
			default : () => {
				return {
					success : true,
					data :[{key : 1}, {key : 2}, {key : 3}]
				}
			}
		},
		bridge : {
			type : Object,
			required : true
		},
	},
	setup : (props) => {

		const data = reactive({
			list : []
		})

		const list = toRef(data, "list")

		const bridge : Bridge = props.bridge as Bridge
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

		const fetchMore = async () => {
			const result = await props.fetchFN()
			data.list = data.list.concat(result.data)


		}
		
		provide("bridge", props.bridge)
		fetchMore()


		return {
			fetchMore,
			list,
			nodes : list.value.map(data => bridge.createLink(data.key, data)),
			classes
		}
	}
}
</script>
