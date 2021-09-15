import {CodeProjectFS} from '../CodeProjectFS'
import fetch from 'node-fetch'

global.fetch = fetch

async function run(){
  await CodeProjectFS.createTemplates()
}

run()