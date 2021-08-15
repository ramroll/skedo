
import { useEffect, useState } from 'react'
import { Select } from 'antd'
import { Topic } from '@skedo/meta'
import 'antd/dist/antd.css'
import style from './prop-editor.module.scss'
import TextAlignSelector from './TextAlignSelector'
import FontStyleSelector from './FontStyleSelector'
import ColorPicker from './ColorPicker'
import Integer from './Integer'
import StringInput from './StringInput'
import PropItem from '../../object/PropItem'
import SizeInput from './SizeInput'
import Image from './Image'
import { PropComponentProps } from './propeditor.types'
import List from './List'

const Option = Select.Option


interface PropItemProps {
  disabled : boolean,
  prop : PropItem
}



const ptnList = /^list<(.*)>$/
function render(type : string, props : PropComponentProps, key : any) : (JSX.Element | null){

  if(type.match(ptnList)) {
    const listType = type.match(ptnList)![1] 
    return (
      <List
        key={key}
        minimum={props.metaProps?.minimum || 2}
        children={[{
          type : listType,
          path : i => [i]
        }]}
        {...props}
        subItemRender={(type : string, props: PropComponentProps, key : any) =>
          render(type, props, key)
        }
      />
    )
  }

  switch(type) {
    case 'list':
      return (
        <List
          key={key}
          minimum={props.metaProps?.minimum || 2}
          children={props.row!.map(x => {
            return {
              type : x.type,
              path : (i) => [i, x.name] 
            }
          })}
          {...props}
          subItemRender={(type : string, props: PropComponentProps, key : any) =>
            render(type, props, key)
          }
        />
      )
    case "name":
      return <StringInput key={key} {...props} regex={/^[a-zA-Z0-9]*$/}  />
    case 'integer':
      return <Integer key={key} {...props} />
    case 'image':
      return <Image key={key} {...props} />
    case 'color':
      return (
        <ColorPicker
          key={key}
          disabled={props.disabled}
          defaultValue={props.propValue}
          onChange={(v) => props.onChange(v)}
        />
      )
    case "select" :
      return (
        <Select
          key={key}
          disabled={props.disabled}
          {...props.metaProps}
          onChange={(value) => props.onChange(value)}
          defaultValue={props.propValue}
        >
          {props.metaProps.selections.map( (item: any) => {
            return <Option key={item.value} value={item.value}>{item.text}</Option>
          })}

        </Select>
      ) 
    case "size":
      return <SizeInput key={key} {...props}  />
    case "font-family":
      return (
        <Select
          key={key}
          {...props.metaProps}
          defaultValue={"Microsoft Yahei"}
          disabled={props.disabled}
          onChange={(value) => props.onChange(value)}
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
          key={key}
          initialValue={props.propValue}
          onChange={(value) => props.onChange(value)}
        />
      )
    case "font-style" :
      return (
        <FontStyleSelector
          key={key}
          initialValue={props.propValue}
          onChange={(value) => {
            props.onChange(value)
          }}
        />
      )
    default:
      return null
  }

}

function renderProp(prop : PropItem, disabled : boolean, key : any){

  return render(prop.meta.type, {
    disabled : disabled || prop.disabled ,
    onChange : (v : any) => {
      prop.set(v)
      return 
    },
    propValue : prop.value,
    metaProps : prop.meta.props
  }, key)
  
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
    {renderProp(prop, disabled, prop.meta.name)}
  </div>
}


export default PropertyItem