import express, {Express} from 'express'
export class Application {

  static inst : Application

  private app : Express 
  constructor(){
    this.app = express()
  }

  listen(){
    this.app.listen(4002)
  }

  getExpress() {
    return this.app
  }
  static getCurrentApplication(){
    if(!Application.inst) {
      Application.inst = new Application()
    }
    return Application.inst 
  }
}