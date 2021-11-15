import {CodeProjectFS} from '../CodeProjectFS'
import path from 'path'
import fetch from 'node-fetch'
import {RollupPackager} from '../Rollup'


global.fetch = fetch
async function run(){
  const fs = new CodeProjectFS(path.resolve(__dirname, "tmp"))
  const project = await fs.download("template", "codeless-template")
  const packager = new RollupPackager(path.resolve(__dirname, 'tmp'))
  await packager.build()
  console.log(project.toJSON())
}

run()