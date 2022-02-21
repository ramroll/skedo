import React from 'react'
import ReactDOM from 'react-dom'

const App : (() => JSX.Element) = () => {
	return <div>
	  <h1>Hello React!</h1>
	</div>
} 


ReactDOM.render(<App />, document.getElementById('root'))