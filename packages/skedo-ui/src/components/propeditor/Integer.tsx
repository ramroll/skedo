import {Input} from 'antd'
import { PropComponentProps } from './propeditor.types'
import useValue from './useValue'
interface IntegerProps {
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
const Integer = ({ onChange, propValue, metaProps , disabled }: IntegerProps  & PropComponentProps) => {
	const [value, setValue] = useValue<number | null>(() => parseInt(propValue), onChange)
  return (
    <Input
      {...metaProps}
			disabled={disabled}
      value={value}
			style={{width : 60}}
      onKeyDown={(e) => {
				if(e.key === 'Backspace' || e.key === "Delete") {
					return
				}
				
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
				if(value === "") {
					setValue(null)
				} else {
					setValue(parseInt(value))
				}
      }}
    />
  )
}

export default Integer