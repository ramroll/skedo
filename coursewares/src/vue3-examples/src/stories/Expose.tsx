import {defineComponent, ref, watch} from 'vue'

const Exposed =  defineComponent({
  setup(_ : any, { expose }) {
    const reset = () => {
      // Some reset logic
      console.log('reset called...')
    }

    expose({
      reset
    })
    return () => <div />
  }
})

export const Expose = () => {


  const item = ref<any>(null)

  watch(item, () => {
    if(item.value) {
      item.value.reset()
    }
  })

  return () => {
    return <Exposed ref={item} />
  }
}

