import {CodeProjectFS} from '../CodeProjectFS'
import path from 'path'
import { CodeProject } from '../CodeProject'
import fetch from 'node-fetch'

global.fetch = fetch
async function run(){
  const project = new CodeProject("codeless-template", "codeless")
  const fs = new CodeProjectFS(path.resolve(__dirname, "../../template/codeless"))
  await fs.upload(project)
}

run()