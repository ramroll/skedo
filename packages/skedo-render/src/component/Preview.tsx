import {Page} from "@skedo/core"

import { NodeRender } from "./NodeRender"
import usePage from "./hooks/usePage"

const Preview = ({pageName} : {pageName : string}) => {

  const pageData = usePage(pageName) 

  if(pageData === null) {
    return null
  }
  const pageObj = new Page(pageName, pageData)

  return (
		<div>
       <NodeRender node={pageObj.root} />
    </div>
  )
}

export default Preview