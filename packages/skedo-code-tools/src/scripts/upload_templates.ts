import {CodeProjectFS} from '../CodeProjectFS'
import fetch from 'node-fetch'

global.fetch = fetch

// @ts-ignore
global.localStorage = {}

async function run(){
  await CodeProjectFS.createTemplates()
}

run()