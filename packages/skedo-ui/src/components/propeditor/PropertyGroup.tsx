import React, {useState} from 'react'
import {CaretDownOutlined,  CaretRightOutlined} from '@ant-design/icons'
import style from './prop-editor.module.scss'
import PropertyItem from './PropertyItem'
import * as R from 'ramda'
import {GroupMeta} from '@skedo/meta'
import PropItem from '../../object/PropItem'


interface GroupProps {
  group : GroupMeta,
  props : {[name : string] : PropItem} 
}
const PropertyGroup = ({group, props} : GroupProps) => {
  const [state, setState] = useState(1)

  const groupStyle = Object.assign({}, group.style)
  if(state === 0) {
    groupStyle.display = "none"
  }

  const list = Object.values(props).filter(x => group.propKeys.has(x.meta.config.name))
  const groupsMap = R.groupBy(
    (x) => x.meta.config.row + "",
    list 
  )

  const groups = Object.values(groupsMap)
  return (
    <div className={style.group}>
      <h2
        onClick={() => {
          setState((x) => 1 - x)
        }}
      >
        <span>{group.title}</span>
        {state === 0 ? <CaretDownOutlined /> : <CaretRightOutlined />}
      </h2>

      <div style={groupStyle}>
        {groups.map((list, i) => {
          return (
            <React.Fragment key={i}>
            <h3 key={"row-label"} className={style['row-label']}>{list[0].meta.config.rowLabel}</h3>
            <div className={`${style['group-row']} ${i===groups.length-1 ? style.last : ''}`}>
              {list.map((prop) => {
                return (
                  <PropertyItem
                    disabled={!!group.disabled}
                    key={prop.meta.config.name}
                    prop={prop}
                  />
                )
              })}
            </div>
            </React.Fragment>
          )
          
        })}
      </div>
    </div>
  )
}


export default PropertyGroup 