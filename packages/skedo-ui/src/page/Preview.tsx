import { useParams } from "react-router"
import TitleBar from "../components/frame/TitleBar"
import style from  "./ui.module.scss"
import { NodeRender } from '@skedo/render'
import { usePage } from "@skedo/render"
import {CordNew, Topic} from "@skedo/meta"
import { useEffect, useLayoutEffect } from "react"

import { RenderContext } from "@skedo/render"
import { Rect } from "@skedo/utils"




const Preview = () => {

	const {page : pageName} = useParams<{[key : string] : string}>()
  const page = usePage(pageName) 
  useEffect(() => {
    requestAnimationFrame(() => {
      if(page !== null) {
        page.emit(Topic.Loaded)
      } 
    });
  }, [page])
  if(page === null) {
    return null
  }



  return (
    <div>
      <TitleBar pageName={pageName} name={"preview"} />
      <div className={style['preview-container']}>
        <RenderContext.Provider value={{
          cord : new CordNew(Rect.ZERO),
          page : page 
        }}>
          <NodeRender node={page.getRoot()} />
        </RenderContext.Provider>
      </div>
    </div>
  )
}

export default Preview