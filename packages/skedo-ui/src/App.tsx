import React from 'react'
import {
  BrowserRouter ,
  Route,
} from "react-router-dom"
import Codeless from './page/Codeless'

import Editor from './page/Editor'
import Preview from './page/Preview'
import FaaS from './page/FaaS'

/**
 * 为每个访问的人生成一个临时的用户
 * 替代注册登录的逻辑
 */
function genTempUser(){
  if ( !localStorage['x-user'] ) {
    localStorage["x-user"] = [...Array(8)].map(
      (x) => String.fromCharCode( Math.floor( 97 + Math.random() * 26 ) )
    ).join('')
  }
}

genTempUser()

const App = () => {

  return <BrowserRouter>
     <Route path="/skedo/:page" >
       <Editor />
     </Route>
     <Route path="/preview/:page" >
       <Preview />
     </Route>
     <Route path="/codeless/:page" >
       <Codeless />
     </Route>
     <Route path="/faas/:page" >
       <FaaS />
     </Route>

     <Route path="/" exact>
       <Editor />
     </Route>
   </BrowserRouter>
}

export default App