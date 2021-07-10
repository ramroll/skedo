
import { useEffect, useState } from 'react'
import { Select } from 'antd'
import {  Topic } from '@skedo/core'
import 'antd/dist/antd.css'
import style from './prop-editor.module.scss'
import TextAlignSelector from './TextAlignSelector'
import FontStyleSelector from './FontStyleSelector'
import ColorPicker from './ColorPicker'
import Integer from './Integer'
import StringInput from './StringInput'
import PropItem from '../../object/PropItem'
import SizeInput from './SizeInput'

const Option = Select.Option


interface PropItemProps {
  disabled : boolean,
  prop : PropItem
}
function renderProp(prop : PropItem, disabled : boolean){
  switch(prop.meta.type) {
    case "name":
      return <StringInput regex={/^[a-zA-Z0-9]*$/} prop={prop} />
    case "integer":
      return (
        <Integer
          prop={prop}
          disabled={disabled || prop.disabled}
        />
      )
    case "color":
      return (
        <ColorPicker
          disabled={disabled || prop.disabled}
          defaultValue={prop.value}
          onChange={(v) => prop.set(v)}
        />
      )
    case "select" :
      return (
        <Select
          disabled={disabled || prop.disabled}
          {...prop.meta.props}
          onChange={(value) => prop.set(value)}
          defaultValue={prop.value}
        >
          {prop.meta.selections.map( (item: any) => {
            return <Option key={item.value} value={item.value}>{item.text}</Option>
          })}

        </Select>
      )
    case "size":
      return <SizeInput prop={prop} {...prop.meta.props} disabled={disabled || prop.disabled} />
    case "font-family":
      return (
        <Select
          {...prop.meta.props}
          defaultValue={"Microsoft Yahei"}
          disabled={disabled || prop.disabled}
          onChange={(value) => prop.set(value)}
        >
          <Option value="Microsoft YaHei">微软雅黑</Option>
          <Option value="宋体">宋体</Option>
          <Option value="arial">Arial</Option>
          <Option value="cursive">cursive</Option>
          <Option value="helvetica">Helvetica</Option>
        </Select>
      )
    case "font-align":
      return (
        <TextAlignSelector
          initialValue={prop.value}
          onChange={(value) => prop.set(value)}
        />
      )
    case "font-style" :
      return (
        <FontStyleSelector
          initialValue={prop.value}
          onChange={(value) => {
            prop.set(value)
          }}
        />
      )
    default:
      return null
  }
}

const PropertyItem = ({prop, disabled} :PropItemProps) => {
  const [, setVer] = useState(0)
  useEffect(() => {
    const sub = prop.on(Topic.PropertyChanged) 
      .subscribe(() => {
        setVer(v =>v + 1)
      })
    return () => {
      sub && sub.unsubscribe()
    }
  }, [prop])
  return <div className={style.prop}>
    {prop.meta.label && <span className={style["prop-label"]}>{prop.meta.label}:</span>}
    {renderProp(prop, disabled)}
  </div>
}


export default PropertyItem