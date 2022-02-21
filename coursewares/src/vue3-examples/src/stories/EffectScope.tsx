import {
  ref,
  Ref,
  onScopeDispose,
  effectScope,
  watch,
  EffectScope,
} from "vue"

function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function handler(e: MouseEvent) {
    x.value = e.x
    y.value = e.y
    // console.log('move', e.x, e.y)
  }

  window.addEventListener("mousemove", handler)

  onScopeDispose(() => {
    window.removeEventListener("mousemove", handler)
  })

  return { x, y }
}

// Some Component
export const EffectScopeExample = {
  
  setup() {
    const enabled = ref(false)
    let mouseState : {
      x: Ref<number>;
      y: Ref<number>;
  } | null, mouseScope: EffectScope

    const dispose = () => {
      mouseScope && mouseScope.stop()
      mouseState = null
    }

    watch(
      enabled,
      () => {
        if (enabled.value) {
          mouseScope = effectScope()
          mouseState = mouseScope.run(() => useMouse()) !
        } else {
          dispose()
        }
      },
      { immediate: true }
    )

    onScopeDispose(dispose)

    return () => {

      return (
        <div>
          <button
            onClick={(e) =>
              (enabled.value = !enabled.value)
            }
          >
            toggle
          </button>
          <p>x={mouseState?.x.value}, y={mouseState?.y.value}</p>
        </div>
      )
    }
  }
}
