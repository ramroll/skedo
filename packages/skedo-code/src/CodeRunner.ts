import { CodeProjectFS } from "./CodeProjectFS";
import {exec} from 'child_process'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'

const execPromise = promisify(exec)

export class CodeRunner{

  cwd : string
  name : string
  prepared : boolean = false
  constructor(name : string, base : string) {
    this.cwd = path.resolve(base, name) 
    this.name = name
  }
  
  private async prepare(){

    if(this.prepared) {
      return
    }
    this.prepared =  true

    console.log('prepare code runner')

    if(fs.existsSync(this.cwd)) {
      fs.rmdirSync(this.cwd, {
        recursive : true
      })
      console.log('rm dir')
    }
    fs.mkdirSync(this.cwd)
    const projectFS = new CodeProjectFS(this.cwd)
    console.log('start download...')
    await projectFS.download(this.name)
    console.log('downloaded.')
    await execPromise("yarn", {
      cwd : this.cwd 
    })
  }

  async run(fnName : string, ...args : Array<any>) {
    await this.prepare()
    const cwd = this.cwd
    // const pkg = await import(path.resolve(cwd, 'build/index.js'))
    const pkg : any = require(path.resolve(this.cwd, 'build/index.js'))
    const fn = pkg[fnName]
    return await fn(...args)
  }
}

// async function run(){
//   global.fetch = require('node-fetch').default
//   const runner = new CodeRunner("default", path.resolve(__dirname, 'tmp'))
//   const result = await runner.run("fn1")
//   console.log(result)
// }

// run()
