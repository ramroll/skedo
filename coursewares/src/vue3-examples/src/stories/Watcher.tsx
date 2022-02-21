import {defineComponent, watchEffect, ref, watch, onUnmounted} from 'vue'
export const WatcheEffectExample01 = defineComponent({
  setup : () => {

    const divRef = ref(null)
    watchEffect(() => {
      if(divRef.value) {
        console.log(divRef.value)
      }
    })
    return () => {
      return <div ref={divRef}></div>
    }
  }
})

export const WatcheEffectExample02 = defineComponent({
  setup : () => {


    const c = ref(0)
    const d = ref(0)

    watchEffect(() => {
      console.log('run... effect', c.value, d.value)
    })

    return () => {
      return <div>
        <button onClick={() => {
          c.value ++
          d.value ++
        }}>+</button>
        {c.value + d.value}</div>
    }
  }
})


export const WatcheEffectExample03 = defineComponent({
  setup : () => {

    const c = ref(0)
    let I = setInterval(() => {
      c.value ++
    }, 1000)

    onUnmounted(() => {
      clearInterval(I)
    })

    return () => {
      return <div>{c.value}</div>
    }
  }
})


export const WatcheExample01 = defineComponent({
  setup : () => {

    const c = ref(0)
    watch(c, (newVal, old) => {
      console.log(`c changed from ${old} to ${newVal}`)
    })

    setTimeout(() => {
      c.value ++
    }, 1000)
    return () => {
      return <div>{c.value}</div>
    }
  }
})


export const WatcheExample02 = defineComponent({
  setup : () => {

    const c = ref(0)
    const d = ref(0)
    const m = ref([1,2,3,4,5])
    // m.value.push(1)
    watch(m, () => {

    })
    watch([c, d], (arrVals, oldValues) => {
      console.log(arrVals, oldValues)
    })

    setTimeout(() => {
      c.value ++
      d.value = 10 
    }, 1000)
    return () => {
      return <div>{c.value + d.value}</div>
    }
  }
})


export const WatcheExample03 = defineComponent({
  setup : () => {

    const c = ref(0)
    // const state = reactive({...})
    watch(() => c.value, (newVal, old) => {
      console.log(`c changed from ${old} to ${newVal}`)
    })

    setTimeout(() => {
      c.value ++
    }, 1000)
    return () => {
      return <div>{c.value}</div>
    }
  }
})