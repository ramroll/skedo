import {ref, computed, defineComponent} from 'vue'
export const ComputedExample01 = defineComponent({
  setup: () => {
    const msg = ref("hello")

    const reversedMsg = computed(() => {
      return msg.value.split("").reverse().join("")
    })

    return () => {
      return <div>
        <input onInput={(e) => {
          msg.value = (e.target as HTMLInputElement).value
        }} />
        {reversedMsg.value}
      </div>
    }
  },
})

export const ComputedExample02 = defineComponent({
  setup: () => {
    const msg = ref("hello")

    const reversedMsg = (msg : string) => {
      return msg.split("").reverse().join("")
    }

    return () => {
      return <div>
        <input onInput={(e) => {
          msg.value = (e.target as HTMLInputElement).value
        }} />
        {reversedMsg(msg.value)}
      </div>
    }
  },
})

export const ComputedExample03 = defineComponent({
  setup() {
    const count = ref(1)
    const plusOne = {
      get value() {
        return count.value + 1
      },
    }
    return () => {
      return (
        <div>
          {plusOne.value}
          <button onClick={() => count.value++}>+</button>
        </div>
      )
    }
  },
})

export const ComputedExample04 = defineComponent({
  setup() {
    let val = 1
    let other = ref(0)
    const someVal = computed({
      get: () => {
        console.log('run...')
        return other.value
        // return val
      },
      set : () => {
        val++
      } 
    }) 
    return () => {
      return (
        <div>
          <p>other {other.value}</p>
          {someVal.value}
          <button onClick={() => {
            other.value++
            someVal.value ++
            console.log('someval', val)
          }}>next</button>
        </div>
      )
    }
  },
})