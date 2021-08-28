import express from 'express'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import {CodeProjectFS} from '@skedo/code/src/CodeProjectFS'
import {RollupPackager} from '@skedo/code/src/Rollup'
import { fileRemote } from '@skedo/request'
import {CodeProjectRepo} from '@skedo/code/src/CodeProjectRepo'
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

  const projectFS = new CodeProjectFS(cwd)
  const project = await projectFS.download(name)

  console.log("project downloaded...")

  const rollup = new RollupPackager(cwd)
  console.log("project downloaded...")

  await rollup.build()

  const uploadResult = await fileRemote.post1(
    "codeless",
    "js",
    fs.readFileSync(path.resolve(cwd, 'build/index.js'), 'utf-8')
  )

  project.setScriptURL(uploadResult.data)

  const repo = new CodeProjectRepo(project)
  await repo.save()
})


const port = process.env.PORT || 7004 

app.listen(port, () => {
  console.log(chalk.greenBright(`successfully listen at ${port}`))
})