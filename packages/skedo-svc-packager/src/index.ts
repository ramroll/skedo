import express from 'express'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import {ProjectBuilder} from '@skedo/code-tools'
import cors from 'cors'
import fetch from 'node-fetch'
import FormData from 'form-data'

// @ts-ignore
global.localStorage = {}
// @ts-ignore
global.fetch = fetch

// @ts-ignore
global.FormData = FormData

const app = express()
app.use(cors())

app.put('/build/:user/:name', async (req, res) => {
  const name = req.params.name
  const user = req.params.user

  const cwd = path.resolve(__dirname, "../tmp")
  console.log('start build...')

  if(!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd)
  }

  const builder = new ProjectBuilder()
  // @ts-ignore
  await builder.build(user, name, cwd)
  res.send({
    success : true
  })

})


const port = process.env.PORT || 7004 

app.listen(port, () => {
  console.log(chalk.greenBright(`successfully listen at ${port}`))
})

// process.stdout.on('data', (err, data) => {
// })

