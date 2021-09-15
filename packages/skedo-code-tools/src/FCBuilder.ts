import {promisify} from 'util'
import {exec} from 'child_process'

export class FCBuilder {
  cwd : string

  constructor(cwd : string) {
    this.cwd = cwd
  }

  async build(){
    const execPromise = promisify(exec)

    try{
      await execPromise("yarn", {
        cwd : this.cwd
      })
      const result = await execPromise("tsc", {
        cwd : this.cwd
      })
      console.log(result)
    }
    catch(ex) {
      console.error(ex)
    }
  }
}