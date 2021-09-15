import {Input, Select} from 'antd'
import { PropComponentProps } from './propeditor.types'
import classes from './prop-editor.module.scss'
import { SizeUnit } from '@skedo/meta'
import { useState } from 'react'

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
  const [mode, setMode] = useState(sizeUnit.getMode())

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
      <span>mode</span>
      <Select
        value={mode}
        onChange={(mode) => {
          sizeUnit.setMode(mode)
          onChange(sizeUnit)
          setMode(mode)
        }}
        disabled={disabled}
      >
        <Option value="auto">auto</Option>
        <Option value="fill">fill</Option>
        <Option value="fixed">fixed</Option>
        <Option value="value">value</Option>
      </Select>
    </div>
  )
}

export default SizeInput 