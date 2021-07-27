import  { useEffect, useState } from 'react'
import {Bridge} from '@skedo/core'
import style from './component.module.scss'
import { fileRemote } from '@skedo/request'

interface ImageProps {
  img : string,
  bridge : Bridge
}

const Image = ({img , bridge} : ImageProps) => {

  const [ver, setVer] = useState(0)

  useEffect(() => {
    setVer(v => v + 1)
  }, [img])


  return (
    <div className={style.image}>
      <input
        key={ver}
        type="file"
        
        onChange={(e) => {
          if (e.target.files) {
            fileRemote.post2(e.target.files[0])
              .then(json => {
                bridge.setPropsValue('img', json.data)
              })
          }
        }}
      />
      <img src={img || "https://voice-static.oss-accelerate.aliyuncs.com//img/4bb56586af7dbf189e410673a734171c9a912fe8.png"} alt="" />
    </div>
  )
}

export default Image