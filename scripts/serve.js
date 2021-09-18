const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

const dir = process.argv[2]
const port = process.argv[3]

app.use("/", express.static(path.resolve(dir)))

const content = fs.readFileSync(path.resolve(dir, "index.html"), 'utf8')
app.get('*', (req, res) => {
  res.send(content)
})



app.listen(port, () => {
  console.log('successfully listen @' + port)
})


