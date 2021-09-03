import React from 'react'
import fs from 'fs'
import path from 'path'
import express from 'express'
import ReactDOMServer from 'react-dom/server'
import Container from './Container'


const app = express() 
app.use('/static', express.static(path.resolve(__dirname, '../build')))

app.get('/', (req, res) => {
  // let str = fs.readFileSync(path.resolve(__dirname, "../build/index.html"), 'utf-8')
  let str = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf-8')
  // str = str.replace("{{ssr}}", ReactDOMServer.renderToString(<Container pageName={"test1"} />))
  res.send(str)
})
const port = process.env.PORT || 3003 
app.listen(port, () => {
  console.log(`listen @${port}`)
})