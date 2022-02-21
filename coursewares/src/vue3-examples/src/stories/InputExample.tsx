import { ref, defineComponent, PropType, watch } from "vue"

const Input = defineComponent({
  props: {
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const input = ref<HTMLInputElement | null>(null)

    watch(
      () => props.value,
      () => {
        const ipt = input.value!
        if(ipt.value !== props.value) {
          ipt.value = props.value || ""
        }
      }
    )
    return () => {
      return (
        <input onInput={e => {
          props.onChange &&
            props.onChange(
              (e.target as HTMLInputElement).value
            )
        }} value={props.value} ref={input} />
      )
    }
  },
})

export const FormExample = defineComponent({
  setup(){
    let formData = {
      username : '张三',
      info : "xxx"
    }

    const ver = ref(0)

    return () => {
      return <div key={ver.value}>
        <button onClick={() => {

          console.log(formData)
          formData = {
            username : '张三',
            info : "xxx"
          }
          ver.value ++
        }}>重置/提交</button>
        <Input
          value={formData.username}
          onChange={(v) => formData.username = v}
        />
        <Input
          value={formData.info}
          onChange={(v) => formData.info = v}
        />
      </div>
    }
  }

})