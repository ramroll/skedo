import  { useContext, useEffect, useRef, useState } from 'react'
import {Bridge, Topic} from '@skedo/meta'
import style from './component.module.scss'
import { fileRemote } from '@skedo/request'
import RenderContext from '../render/RenderContext'

interface ImageProps {
  img : string,
  bridge : Bridge
}

const Image = ({img , bridge} : ImageProps) => {

  const [ver, setVer] = useState(0)
  const context = useContext(RenderContext)
  const sel = useRef(false)


  useEffect(() => {

    let I : any = null
    const unsub = context.editor?.on(Topic.SelectionChanged)
      .subscribe(e => {
        if(context.editor?.getSelection().contains(bridge.getNode())) {
          I = setTimeout(() => {
            sel.current = true
          }, 100)
        } else {
          console.log('clear sel')
          clearTimeout(I)
          sel.current = false
        }
      })
    return () => {
      if(unsub) {
        unsub.unsubscribe()
      }
    }

  },[])


  useEffect(() => {
    setVer(v => v + 1)
  }, [img])

  return (
    <div className={style.image}>
      <input
        key={ver}
        type="file"
        onClick={e => {
          console.log('click:' + sel.current)
          if(!sel.current) {
            e.preventDefault()
            e.stopPropagation()
            return
          }

          console.log('here---')
        }}
        onChange={(e) => {
          if (e.target.files) {
            fileRemote.post2(e.target.files[0])
              .then( (json) => {
                bridge.setPropValue(['img'], json.data)
              })
          }
        }}
      />
      <img src={img || "https://voice-static.oss-accelerate.aliyuncs.com//img/4bb56586af7dbf189e410673a734171c9a912fe8.png"} alt="" />
    </div>
  )
}

export default Image