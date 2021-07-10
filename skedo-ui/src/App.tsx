import React from 'react'
import {
  BrowserRouter ,
  Route,
} from "react-router-dom"

import All from './testpage/All'

const App = () => {
  return <BrowserRouter>
     <Route path="/page/:page">
       <All />
     </Route>
   </BrowserRouter>
}

export default App