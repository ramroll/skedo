import React from 'react'
import {
  BrowserRouter ,
  Route,
} from "react-router-dom"
import Codeless from './page/Codeless'

import Editor from './page/Editor'
import Preview from './page/Preview'

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
     <Route path="/" exact>
       <Editor />
     </Route>
   </BrowserRouter>
}

export default App