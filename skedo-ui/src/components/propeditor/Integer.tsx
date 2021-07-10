import {Input} from 'antd'
import PropItem from '../../object/PropItem'
import useValue from './useValue'
interface IntegerProps {
	prop : PropItem,
	disabled? : boolean
}

function parseInt(value : string | number) : number | null {
	if(typeof value === 'number') {
		return value
	}
	
	if(/^\d+px\$/.test(value)) {
		value = value.replace("px", "")
	}
	if(value === '' || value === undefined) {
		return null
	}
	const val = Number.parseInt(value)
	if(isNaN(val)) {
		return null
	}
	return val
}
const Integer = ({ prop, disabled }: IntegerProps) => {
	const [value, setValue] = useValue<number | null>(() => parseInt(prop.value), prop)
  return (
    <Input
      {...prop.meta.props}
			disabled={prop.disabled}
      value={value}
			style={{width : 60}}
      onKeyDown={(e) => {
				if(e.key === "ArrowUp") {
					setValue( value => {
						if(value === null) {return 1}
						return value + 1
					})
					return
				}
				else if(e.key === 'ArrowDown') {
					setValue((value) => {
            if (value === null) {
              return 0
            }
            return Math.max(0, value - 1)
          })
				}

				if(!e.key.match(/[0-9]/)) {
					e.preventDefault()
					e.stopPropagation()
					return
				}
      }}
      onChange={(e) => {
        const value = e.target.value
				setValue(parseInt(value))
      }}
    />
  )
}

export default Integer