import { NodeRender } from "./NodeRender"
import {usePage} from "../hooks/usePage"

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