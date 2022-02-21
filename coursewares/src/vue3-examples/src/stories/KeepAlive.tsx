import {KeepAlive, defineComponent, onActivated, ref} from 'vue'

const Foo = defineComponent({
  props : {
    name : {
      type : String
    }
  },
  setup : (props) => {
    onActivated(()=>{
      console.log(props.name, "activated")
    })

    return () => {
      return <div>{props.name}</div>
    }
  }
})
const Switch = ({toggle} : {toggle:boolean}) => {
  return (
    <>
      <KeepAlive>{toggle && <Foo name="A" />}</KeepAlive>
      <KeepAlive>{!toggle && <Foo name="B" />}</KeepAlive>
    </>
  )
}

export const KeepAliveExample = defineComponent({
  setup:() => {

    const toggle = ref(false)

    return () => <div>
      <button onClick={() => toggle.value = !toggle.value}>toggle</button>
      <Switch toggle={toggle.value} />
    </div>

  }
})