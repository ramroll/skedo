import ComponentTreeRoot from '../components/ComponentTreeRoot'
import EditorModel from '../object/EditorModel'
import style from  "../style/core.module.scss"
import PropEditor from '../components/propeditor/ComponentPropEditor'
import ComponentList from '../components/ComponentList'
import {useEffect, useMemo} from 'react'

import {Tabs} from 'antd'
import React from 'react'
import { useParams } from 'react-router-dom'
import useEditor from '../hooks/useEditor'

const { TabPane } = Tabs

const json = {
  type : "page",
  group : "basic",
  rect : [(3200-414)/2, 40, 414, 736],
  children : [
  ],
  style : {
    border : "1px solid #eee",
    backgroundColor : 'white'
  }
}


interface RouteProps {
  src : string,
  active? :boolean

}
const Route = ({ src, active }: RouteProps) => {
  return (
    <div className={style.btn + " " + (active ? style.active : '')}>
      <img src={src} alt="" />
    </div>
  )
}
const TitleBar = () => {
  return (
    <header className={style.titlebar}>
      <h2>SKEDO</h2>
      <div className={style.router}>
        <Route active src="https://voice-static.oss-accelerate.aliyuncs.com//img/901888239b96b6f1d39ce060cc0b57009236bfa3.png" />
        <Route src="https://voice-static.oss-accelerate.aliyuncs.com//img/8ff6fd7149b9def759a1f1c6760ac1beaf18557d.png" />
        <Route src="https://voice-static.oss-accelerate.aliyuncs.com//img/7d614228eaaa473246435d58e5c51700732d88f8.png" />
        <Route src="https://voice-static.oss-accelerate.aliyuncs.com//img/7ced72ba49b0a9514f7c22606ad87e21eb56c2ed.png" />
        <Route src="https://voice-static.oss-accelerate.aliyuncs.com//img/7e463508667bfc093130e8cd84690c12396cc2c2.png" />
      </div>
    </header>
  )
}

const BottomBar = () => {
  return <div className={style.footer}></div>
}

const All = () => {
  const [editor]  = useEditor()

  useEffect(() => {

    if(!editor) {
      return
    }

    document.addEventListener("keydown", editor.onKeyDown)
    document.addEventListener("keyup", editor.onKeyUp)

    return () => {

      document.removeEventListener("keydown", editor.onKeyDown)
      document.removeEventListener("keyup", editor.onKeyUp)
    }

  }, [editor])

  if(!editor) {
    return null
  }

	return <React.Fragment>
    <TitleBar />
    <div className={style.container}>
			<ComponentList editor={editor} />
      <ComponentTreeRoot
        node={editor.page.root}
        editor={editor}
      />
      <div className={style["right"]}>
        <RightTabs editor={editor} />
      </div>
    </div>
    <BottomBar />
  </React.Fragment> 
}

interface RightTabsProps {
  editor : EditorModel
}
const RightTabs = ({editor} : RightTabsProps) => {
  return <Tabs defaultActiveKey="1" type="card">
    <TabPane tab="属性编辑" key="1">
      <PropEditor editor={editor} />
    </TabPane>
    <TabPane tab="页面结构" key="2">
    </TabPane>
  </Tabs>
}

export default All