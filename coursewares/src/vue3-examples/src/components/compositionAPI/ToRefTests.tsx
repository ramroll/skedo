import { defineComponent, reactive, ref, toRef, toRefs } from "vue"

export default defineComponent({
	setup() {

		const state = reactive({
			a : 1,
			b : '-' ,
			c : ref(100)
		})

		const x = ref(0)

		// const o = reactive(ref(0))
		const aRef = toRef(state, 'a')
		const bRef = toRef(state, 'b')
		const cRef = toRef(state, 'c')
		// cRef is Ref<number>

		// 等价于
		// const refs = toRefs(state)
		// const aRef === refs.a
		// const bRef === refs.b

		return () => {
			return <>
				<h1>aRef : {aRef.value}</h1>
				<h1>aRef : {aRef}</h1>
				<h1>bRef : {bRef.value}</h1>
				<h1>bRef : {bRef}</h1>
				<button onClick={() => state.a++}>state.a++</button>
				<button onClick={() => aRef.value++}>aRef.a++</button>
			</>
		}
	}
})