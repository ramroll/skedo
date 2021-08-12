import {Input, Select} from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import { PropComponentProps } from './propeditor.types'
import classes from './prop-editor.module.scss'
import { SizeUnit } from '@skedo/meta'
import { useState } from 'react'
interface SizeInputProps {
}

const Option = Select.Option
const SizeInput = ({
  propValue,
  disabled,
  onChange,
  metaProps,
}: PropComponentProps) => {

  const sizeUnit : SizeUnit = propValue

  const [value ,setValue] = useState(sizeUnit.getValue())
  const [unit,setUnit] = useState(sizeUnit.getUnit())
  const [fixed, setFixed] = useState(sizeUnit.getMode() === 'fixed')

  return (
    <div className={classes["size-input"]}>
      <label style={{ width: "40px" }}>
        {metaProps.suffix}:{" "}
      </label>
      <Input
        disabled={disabled}
        onChange={(e) => {
          const value = Number.parseInt(e.target.value)
          if (isNaN(value)) {
            return
          }
          sizeUnit.setValue(value)
          onChange(sizeUnit)
          setValue(value)
        }}
        value={value}
        style={{ width: "60px" }}
      />
      <span style={{ width: "10px" }}></span>
      <Select
        value={unit}
        onChange={(unit) => {
          sizeUnit.setUnit(unit)
          onChange(sizeUnit)
          setUnit(unit)
        }}
        disabled={disabled}
      >
        <Option value="px">px</Option>
        <Option value="%">%</Option>
      </Select>
      <span style={{ width: "10px" }}></span>
      <span>fixed</span>
      <Checkbox
        checked={fixed}
        disabled={disabled}
      ></Checkbox>
    </div>
  )
}

export default SizeInput 