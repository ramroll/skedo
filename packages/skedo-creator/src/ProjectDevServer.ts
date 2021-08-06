import chalk from 'chalk'
import express, {Express}  from 'express'
import { projPathResolve } from './resolver'

export default class ProjectDevServer {

  port : number
  app : Express 
  constructor(port : number) {
    this.port = port
    this.app = express() 
  }

  start(){
    this.app.get('/', (req, res) => {
      res.sendFile(projPathResolve("index.html"))
    })

    this.app.use('/', express.static(projPathResolve('./build')))

    const port = this.port 
    this.app.listen(port, () => {
      console.log(chalk.greenBright("successfully listen @" + port))
    })
  }
}