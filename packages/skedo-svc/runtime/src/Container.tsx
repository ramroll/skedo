import React from 'react'
import {NodeRender, usePage} from '@skedo/render'

export default ({pageName } : {
  pageName : string
}) => {
  const page = usePage(pageName) 
  if(page === null) {
    return null 
  }
  return <NodeRender node={page.root} />
}