import {Page} from "@skedo/meta"

import { NodeRender } from "./NodeRender"
import usePage from "./hooks/usePage"
import {ComponentsLoader} from '@skedo/loader'

const Preview = ({pageName} : {pageName : string}) => {

  const pageData = usePage(pageName) 

  if(pageData === null) {
    return null
  }
  const pageObj = new Page(pageName, pageData, ComponentsLoader)

  return (
		<div>
       <NodeRender node={pageObj.root} />
    </div>
  )
}

export default Preview