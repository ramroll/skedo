import { CodeProjectFS } from "./CodeProjectFS";
import {exec} from 'child_process'
import { promisify } from "util";
import path from "path";
import fs from 'fs'
import { fn1 } from "./tmp/default/src";

const execPromise = promisify(exec)

export class CodeRunner {

  constructor(private user : string, private project : string, private cwd : string) {
  }

  private async prepare() {
    if(fs.existsSync(this.cwd)) {
      fs.rmdirSync(this.cwd, {
        recursive : true
      })
    }
    fs.mkdirSync(this.cwd)
  }

  private async build(){

    const projectFS = new CodeProjectFS(this.cwd)
    await projectFS.download(this.user, this.project)
    await execPromise("yarn", {
      cwd : this.cwd
    })
  }

  async run(fnName : string, ...args : any[]) {
    await this.prepare()
    await this.build()
    const module = require(path.resolve(this.cwd, "build/index.js"))
    const fn = module[fnName]
    return await fn(...args)
  }
}