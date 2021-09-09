import UIModel from '../object/UIModel'
import style from  "./ui.module.scss"
import PropEditor from '../components/propeditor/ComponentPropEditor'
import ComponentList from '../components/ComponentList'
import {useEffect } from 'react'

import {Tabs} from 'antd'
import React from 'react'
import useEditor from '../hooks/useEditor'
import Panel from '../components/render/Panel'
import NodeRender from '../components/render/NodeRender'
import TitleBar from '../components/frame/TitleBar'
import { useParams } from 'react-router-dom'
import {PageStructure} from '../components/PageStructure'

const { TabPane } = Tabs


const BottomBar = () => {
  return <div className={style.footer}></div>
}

const Skedo = () => {
  let {page : pageName} = useParams<{[key : string] : string}>()
  if(!pageName) {
    pageName = 'default'
  }
  const [editor]  = useEditor(pageName)

  useEffect(() => {

    if(!editor) {
      return
    }

    setInterval(() => {
      editor.save()
    }, 2000)

  }, [editor])

  if(!editor) {
    return null
  }

	return <React.Fragment>
    <TitleBar pageName={pageName} name="skedo" />
    <div className={style.container}>
			<ComponentList editor={editor} />
      <Panel editor={editor}>
        <NodeRender node={editor.page.root} />
      </Panel>
      <div className={style["right"]}>
        <RightTabs editor={editor} />
      </div>
    </div>
    <BottomBar />
  </React.Fragment> 
}

interface RightTabsProps {
  editor : UIModel
}
const RightTabs = ({editor} : RightTabsProps) => {
  return <Tabs defaultActiveKey="1" type="card" style={{
    height : '100%'
  }}>
    <TabPane tab="属性编辑" key="1">
      <PropEditor editor={editor} />
    </TabPane>
    <TabPane tab="页面结构" key="2">
      <PageStructure editor={editor} />
    </TabPane>
  </Tabs>
}

export default Skedo