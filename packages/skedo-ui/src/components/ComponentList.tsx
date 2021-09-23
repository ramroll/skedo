import { useRef } from 'react'
import { UIModel, UIEvents } from '../object/UIModel'
import { ComponentMeta } from '@skedo/meta'
import {ComponentsLoader} from '@skedo/loader'
import style from './compo-list.module.scss'
import { groupBy } from 'ramda'

interface ComponentListProps {
  editor : UIModel
}
const ComponentList = ({editor} : ComponentListProps) => {

	const loader = useRef(ComponentsLoader.get())

  const groupTitle : any = {
    basic : "基础组件",
    container : "容器组件",
    "custom-react" : "外部React组件",
    "custom-vue" : "外部Vue组件",
  }

  const groupList = Object.values(groupBy(x => x.group, loader.current.list))

	return (
    <div className={style["component-list"]}>
      <div className={style["component-list-inner"]}>
        {groupList.map( (list : Array<ComponentMeta>, i) => {
          const title = groupTitle[list[0].group]
          return <div key={i} className={style['component-list-group']}>
            <h2>{title}</h2> 
            {list.map((compConf) => {
            return (
              <div
                key={compConf.name}
                draggable
                onDragStart={(event) => {
                  event.preventDefault()
                  editor.dispatch(UIEvents.EvtStartDragAdd, compConf)
                }}
                className={style["component-list-item"]}
              >
                <img src={compConf.imageUrl} alt="" />
                <div className={style.text}>
                  {compConf.title}
                </div>
              </div>
            )
          })}
          <div style={{ clear: "both" }}></div>
          </div>
        })}
        
      </div>
    </div>
  )
}
export default ComponentList