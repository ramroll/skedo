import { reactive} from "vue"

export default {
  setup() {
    const state = reactive({
      counter : 0
    })
    return () => (
      <div>
        {state.counter}
        <button
          onClick={() => {
            state.counter++
          }}
        >
          add
        </button>
      </div>
    )
  },
}