import { ref } from "vue"

export default {
	setup() {
		const msg = ref("hello")
		return () => {
			return <div>{msg.value}</div>
		}
	}
}