import {
  ref,
  defineComponent,
  PropType,
  watch,
} from "vue"

import {Input} from '../components/Input'
import {useForm} from '../hooks/useForm'

export const FromExample02 = defineComponent({
  setup() {
    const {form, ver} = useForm({
      username: "张三",
      info: "xxx",
    })

    watch(form.getValues(), () => {
      console.log('form data changed', form.getValues().value)
    })

    return () => (
      <div>
        <button
          onClick={() => {
            const values = form.getValues().value
            console.log("submit", values)
            form.setValues({
              username: "张三",
              info: "xxx",
            })
            ver.value++
          }}
        >
          提交/重置
        </button>
        <Input
          {...form.username}
        />
        <Input
          {...form.info}
        />
      </div>
    )
  },
})
