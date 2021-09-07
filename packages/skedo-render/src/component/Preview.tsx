import {Page} from "@skedo/meta"

import { NodeRender } from "./NodeRender"
import { usePage } from "../hooks/usePage"
import {ComponentsLoader} from '@skedo/loader'

const Preview = ({pageName} : {pageName : string}) => {

  const page = usePage(pageName) 

  if(page === null) {
    return null
  }
  return (
		<div>
       <NodeRender node={page.root} />
    </div>
  )
}

export default Preview