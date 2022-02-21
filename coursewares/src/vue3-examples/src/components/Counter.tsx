import { lexicalScoped, effect }  from '@skedo/vue-lexical-cache'
import { defineComponent, ref } from 'vue'

lexicalScoped("ref", "effect")


const X =() => {
  const [v, setv] = useState(0)
  return <div /> 
}

defineComponent({
  setup() {
    const counter = ref(0)
    setTimeout(() => {
      counter.value++
    }, 1000)
    return () => {
      console.log(counter.value)
      // track
      return <div>{counter.value}</div>
    }
  }
})

export default () => {
  // per lexical scope + per vNode
  const counter = ref(0)
	effect(() => {
		console.log('value changed to', counter.value)
	}, [counter.value])

	return (
    <div>
      {counter.value}
      <button
        onClick={() => {
          counter.value++
					console.log('clicked', counter.value)
        }}
      >
        add
      </button>
    </div>
  )
}