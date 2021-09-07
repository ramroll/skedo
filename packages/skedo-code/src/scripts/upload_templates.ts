import {CodeProjectFS} from '../CodeProjectFS'
import path from 'path'
import { CodeProject } from '../CodeProject'
import fetch from 'node-fetch'

global.fetch = fetch

async function run(){
  await CodeProjectFS.createTemplates()
}

run()