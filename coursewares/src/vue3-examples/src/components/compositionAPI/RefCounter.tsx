import { defineComponent, ref } from "vue"

export default defineComponent({
  setup() {
    const counter = ref(0)
    return () => (
      <div>
        {counter.value}
        <button
          onClick={() => {
            counter.value++
          }}
        >
          add
        </button>
      </div>
    )
  },
})