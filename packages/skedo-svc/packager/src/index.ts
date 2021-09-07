import express from 'express'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import {ProjectBuilder} from '@skedo/code/src/ProjectBuilder'
import cors from 'cors'
import fetch from 'node-fetch'
import FormData from 'form-data'

// @ts-ignore
global.fetch = fetch

// @ts-ignore
global.FormData = FormData

const app = express()
app.use(cors())

app.put('/build/:name', async (req, res) => {
  const name = req.params.name

  const cwd = path.resolve(__dirname, "../tmp")
  console.log('start build...')

  if(!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd)
  }

  const builder = new ProjectBuilder()
  await builder.build(name, cwd)
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

