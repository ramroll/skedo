import { defineComponent, ref, onRenderTracked, onRenderTriggered } from 'vue'

export const TrackExample = defineComponent({
  setup : () => {

      const count = ref(0)

      onRenderTriggered(e => {
        console.log('trigger', e)
      })

      onRenderTracked(e => {
        console.log('track', e)
      })

      setInterval(() => {
        count.value ++
      }, 1000)

      return () => <div>
        {count.value}
      </div>
  }
})
