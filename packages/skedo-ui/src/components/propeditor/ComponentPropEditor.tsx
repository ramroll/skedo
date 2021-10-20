import { useEffect, useState } from 'react'

import { UIModel } from '../../object/UIModel'
import { Topic } from '@skedo/meta'
import style from './prop-editor.module.scss'
import "./antd-patch.css"


import PropertyGroup from './PropertyGroup'

interface PropEditorProps {
  editor : UIModel,
}

const ComponentPropEditor = ({editor} : PropEditorProps) => {

  const [ver, setVer] = useState(0)
  useEffect(() => {
    const sub = editor.propertyEditor.on(Topic.PropertyModelUpdated)
      .subscribe(() => {
        setVer(v => v + 1)
      })

    return () => {
      sub && sub.unsubscribe()
    }
  }, [editor])
  return (
    <div className={style.editor} key={ver}>
      <div className={style.scroller}>

      {editor.propertyEditor.groups.map((group) => {
        return <PropertyGroup key={group.name} group={group} props={editor.propertyEditor.props} />
      })}
      </div>
    </div>
  )
}

export default ComponentPropEditor