import express from 'express'
import fs from 'fs'
import path from 'path'
// import ReactDOMServer from 'react-dom/server'
// import App from './App'

const app = express()

const port = process.env.PORT || 3003

app.use(
  "/static",
  express.static(
    path.resolve(__dirname, "../build")
  )
)

app.get('/', (req, res) => {
  const ssr = req.query.ssr
  if(ssr) {

    // let str = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf-8')

    // // const rootStr = ReactDOMServer.renderToString(<App />)

    // const jsonp = `<script>cache("abc", {expired, data})</script>`
    // str = str.replace("{ssr}", rootStr)
    // str = str.replace("{data}", jsonp)
    // res.send(str)


  } else {
    const str = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf-8')
    res.send(str)
  }
})
app.listen(port, () => {
  console.log(`listen @${port}`)
})