import {Input} from 'antd'
import PropItem from '../../object/PropItem'
import useValue from './useValue'
interface IntegerProps {
	prop : PropItem,
	regex : RegExp
}


const StringInput = ({ regex, prop }: IntegerProps) => {
  const [value, setValue] = useValue<string>(prop.value, prop)
  return (
    <Input
			style={{width : 200}}
      {...prop.meta.props}
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