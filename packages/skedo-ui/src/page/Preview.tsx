import { useParams } from "react-router"
import TitleBar from "../components/frame/TitleBar"
import style from  "./ui.module.scss"
import { NodeRender } from '@skedo/render'
import usePage from "../hooks/usePage"
import {Page} from "@skedo/core"

const Preview = () => {

	const {page : pageName} = useParams<{[key : string] : string}>()
  const pageData = usePage(pageName) 

  if(pageData === null) {
    return null
  }
  const pageObj = new Page(pageName, pageData)

  return (
    <div>
      <TitleBar pageName={pageName} name={"preview"} />
      <div className={style.container}>
        <NodeRender node={pageObj.root} />
      </div>
    </div>
  )
}

export default Preview