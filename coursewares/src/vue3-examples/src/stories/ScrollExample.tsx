import { defineComponent } from "vue"

class ScrollDescriptor {
  private left: number = 0
  private top: number = 0
  private scrollHeight: number = 0
  private offsetHeight: number = 0

  private scrollToBottomHandlers: Function[] = []

  public onScrollToBottom(handler: Function) {
    this.scrollToBottomHandlers.push(handler)
    return () => {
      this.scrollToBottomHandlers =
        this.scrollToBottomHandlers.filter(
          (x) => x !== handler
        )
    }
  }

  private triggerScrollToBottom() {
    this.scrollToBottomHandlers.forEach((h) => h())
  }

  public update(
    left: number,
    top: number,
    offsetHeight: number,
    scrollHeight: number
  ) {
    this.left = left
    this.top = top
    this.scrollHeight = scrollHeight
    this.offsetHeight = offsetHeight
    if (this.bottomReached()) {
      this.triggerScrollToBottom()
    }
  }

  public bottomReached() {
    return this.top + this.offsetHeight >= this.scrollHeight
  }
}

const useScroll = () => {
  const scrollInfo = new ScrollDescriptor()

  const scrollHandler = <T extends HTMLElement>(
    e: Event
  ) => {
    const scroller = e.currentTarget as T
    const left = scroller.scrollLeft
    const top = scroller.scrollTop
    scrollInfo.update(
      left,
      top,
      scroller.offsetHeight,
      scroller.scrollHeight
    )
  }

  return {
    onScroll: scrollHandler,
    info: scrollInfo,
  }
}

export const ScrollerExample = defineComponent({
  setup() {
    const { onScroll, info } = useScroll()

    info.onScrollToBottom(() => {
      console.log('here---')
    })
    return () => (
      <div
        onScroll={onScroll}
        style={{
          height: '600px',
          width: '400px',
          overflow: "scroll",
        }}
      >
        <div
          style={{
            height: '800px',
            width: "100%",
            background: "red",
          }}
        ></div>
        <div
          style={{
            height: '800px',
            width: "100%",
            background: "blue",
          }}
        ></div>
        <div
          style={{
            height: '800px',
            width: "100%",
            background: "yellow",
          }}
        ></div>
      </div>
    )
  },
})
