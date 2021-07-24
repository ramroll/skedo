import { useEffect, useRef, useState } from 'react'
import { EditorModel } from '../object/EditorModel'
import {Topic, ComponentMeta} from '@skedo/core'
import ComponentsLoader from '../object/ComponentsLoader'
import style from '../style/core.module.scss'
import { groupBy } from 'ramda'

interface ComponentListProps {
  editor : EditorModel
}
const ComponentList = ({editor} : ComponentListProps) => {

	const loader = useRef(ComponentsLoader.get())
	const [list, setList] = useState<Array<ComponentMeta>>([])
	useEffect(() => {
    loader.current.on(Topic.Loaded).subscribe(() => {
      setList(loader.current.list)
    })
    loader.current.load()
  }, [])

  const groupTitle : any = {
    basic : "基础组件",
    custom : "业务组件库2",
    custom1 : "业务组件库1"
  }

  const groupList = Object.values(groupBy(x => x.group, list))

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

                  let div = document.getElementById('dragimage')
                  if(!div) {
                    div = document.createElement("div")
                    div.setAttribute("id", "dragimage")
                    div.style.width = "1px" 
                    div.style.height = "1px"
                    document.body.append(div)
                  }
                  event.dataTransfer.setDragImage(div, 1, 1)
                  editor.onDragStart(compConf)
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