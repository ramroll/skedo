import { useEffect, useState } from 'react'
import classes from './form.module.scss'
import { FormNode } from './FormNode'
export const FormRender = ({node} : {
  node : FormNode 
}) => {

  const [value, setValue] = useState(node.getValue())
  const [props, setProps] = useState(node.getProps())

  useEffect(() => {

    node.on("node-value-changed", () => {
      setValue(node.getValue())
    })
    node.on("node-props-changed", () => {
      setProps(node.getProps())
    })

  }, [])

  useEffect(() => {
    node.onDataChange(value)
  }, [value])

  const type = node.getType()
  const passProps : any = {
    ...props,
  }

  if(node.isInputNode()){
    passProps.value = value
    passProps.onChange =  (value : any) => setValue(value)
  }
  console.log('passProps', passProps)
  switch(type) {
    case "input" :
      return <Input 
        {...passProps}
      />
    case 'branch':
      return <Branch {...props} children={node.getChildren()} />
    case "form" :
      return <div>
        {node.getChildren().map((child, i) => <FormRender key={i} node={child}  />)}
      </div>
    case 'form-group' :
      return <div className={classes['form-group']}>
        {node.getChildren().map( (child, i) => <FormRender key={i} node={child} />)}
      </div>
    case 'single-choice' :
      return <SingleChoice 
        {...passProps} 
      />
    default:
      return null
  }

}

type Option = {
  label : string,
  value : any
}

const Branch = ({children, active } : {
  children : FormNode[],
  active : number
}) => {
  console.log('active', children[active || 0])
  return <FormRender key={active} node={children[active || 0]} />

}

const Input = ({label, onChange, value } : {
  onChange : (value : any) => void, 
  label : string,
  value : any
}) => {

  return <div>
    <label>{label}</label>
    <input 
      value={value || ""} 
      onChange ={(e) => {
        onChange((e.target as HTMLInputElement).value)
      }}/>
  </div>
}
const SingleChoice = ( { selection, label, onChange }
  : {
    selection: Option[],
    label: string,
    onChange: (value: any) => void
  }) => {

  return <div>
    <label>{label}</label>
    <select onChange={e => {
      onChange(e.target.value)
    }}>
      {selection.map(option => {
        return <option value={option.value} key={option.value}>{option.label}</option>
      })}
    </select>
  </div>
}