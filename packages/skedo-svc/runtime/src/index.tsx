import React from 'react'
import ReactDOM from 'react-dom'
import Container from './Container'

ReactDOM.hydrate(
  <Container pageName="test1" />,
  document.getElementById("root")
)