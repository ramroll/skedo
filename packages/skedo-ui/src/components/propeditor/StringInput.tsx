import {Input} from 'antd'
import { PropComponentProps } from './propeditor.types'
import useValue from './useValue'
interface IntegerProps {
  style? : any,
	regex : RegExp
}


const StringInput = ({
  regex,
  propValue,
  metaProps,
  onChange,
  style
}: IntegerProps & PropComponentProps) => {
  const [value, setValue] = useValue<string>(
    propValue,
    onChange
  )
  return (
    <Input
      style={{ width: 200 , ...style}}
      {...metaProps}
      value={value}
      onKeyDown={(e) => {
        if (e.key === "Delete" || e.key === "Back") {
          return
        }
        if (!e.key.match(regex)) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }}
      onChange={(e) => {
        const value = e.target.value
        setValue(value)
      }}
    />
  )
}

export default StringInput 