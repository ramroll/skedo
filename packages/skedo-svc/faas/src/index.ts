import express from 'express'
import path from 'path'
import {CodeRunner} from '@skedo/code/src/CodeRunner'
import fetch from 'node-fetch'

const app = express()
const port = process.env.PORT || 7005

// @ts-ignore
global.fetch = fetch 

const cache : Record<string, CodeRunner> = {}
app.get('/faas/:page', async (req, res) => {
  const name = req.params.page
  const fn = (req.query.fn as string) || "default"
  
  let runner : CodeRunner


  if(cache[name]) {
    runner = cache[name]
  }
  else {
    runner = new CodeRunner(
      name,
      path.resolve(__dirname, "../runners")
    )
    cache[name] = runner
  }


  try{

    const result = await runner.run(fn)
    res.send({
      success : true,
      data : result
    })
  }
  catch(ex) {
    console.error(ex)

    res.status(500).send({
      success : false
    })
  }




})

app.listen(port, () => {
  console.log('listen @' + port)
})