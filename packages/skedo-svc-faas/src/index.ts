import express from 'express'
import path from 'path'
import { CodeRunner } from '@skedo/code-tools'
import fetch from 'node-fetch'


// @ts-ignore
global.fetch = fetch


const app = express()
const port = process.env.PORT || 7005

app.get('/:user/:page/:fn', async (req, res) => {
  const { user, page, fn } = req.params
  try {
    const runner = new CodeRunner(user, 'faas-' + page, path.resolve(__dirname, "../tmp"))
    const result = await runner.run(fn)
    res.send(result)
  } catch(ex) {
    console.error(ex)
    res.status(500).send(ex.toString())
  }

})

app.listen(port, () => {
  console.log(`successfully listen @${port}`)
})