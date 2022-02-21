import {defineComponent} from 'vue'

const Button = ({text} : {text : string}) => {
  return <button>{text}</button>
}

const ButtonWithSlots = (_ : any, context : any) => {
  return <button>{context.slots.default()}</button>
}


export const ButtonExample01 = () => {
  return (
    <Button text="你好!" />
  )
}

export const ButtonExample02 = () => {
  return <ButtonWithSlots>你好！</ButtonWithSlots>
}

const Button02 = ({item} : {item : JSX.Element}) => {
  return <button>{item}</button>
}

export const ButtonExample03 = () => {
  return <Button02 item={<div>你好</div>} />
}


