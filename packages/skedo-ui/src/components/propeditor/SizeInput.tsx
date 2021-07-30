import {Input} from 'antd'
import { debounce, parseSizeUnit, SizeUnit } from '@skedo/core'
import PropItem from '../../object/PropItem'
import useValue from './useValue'
import { useEffect, useRef } from 'react'
import { PropComponentProps } from './propeditor.types'
interface SizeInputProps {
}

const SizeInput = ({ propValue, disabled, onChange, metaProps }: SizeInputProps & PropComponentProps) => {
	const [value, setValue] = useValue<SizeUnit | null>(propValue, onChange)
	const ref = useRef<any>(null)
	const debouncedOnChange = debounce( (e) => {
		const value = e.target.value
		setValue(parseSizeUnit(value))
	}, 500)

	useEffect(() => {
		const ele = ref.current
		if(ele) {
			ele.setValue( (value?.value || "") + (value?.unit || "") )
		}
	}, [value])
  return (
    <Input
			ref={ref}
      {...metaProps}
			disabled={disabled}
      // initialValue={(value?.value || "") + (value?.unit || '')}
			style={{width : 60}}
      onKeyDown={(e) => {
				if(e.key === "ArrowUp") {
					setValue( value => {
						if(!value) {
							return value
						}
						return {...value, value : value.value + 1}
					})
					return
				}
				else if(e.key === 'ArrowDown') {
					setValue( value => {
						if(!value || value.value <= 0) {
							return value
						}
						return {...value, value : value.value - 1}
					})
				}
				
      }}
      onChange={debouncedOnChange}
    />
  )
}

export default SizeInput 