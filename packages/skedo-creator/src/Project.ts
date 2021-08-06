// 1. 创建项目

import ProjectCreator from "./ProjectCreator"
import ProjectDevServer from "./ProjectDevServer"
import ProjectRollupInstance from "./ProjectRollupInstance"

// 2. npm run dev
export default class Project {

  private name : string
  private dir : string
  constructor(name? : string){
    this.name = name  || ""
    this.dir = process.cwd()
  }

  public getCwd(){
    return this.dir
  }

  public setCwd(cwd : string) {
    this.dir = cwd
    process.chdir(this.dir)
  }

  public getName(){
    return this.name
  }

  public devServer(port : number) {
    const devServer = new ProjectDevServer(port)
    devServer.start()
  }

  public watch(){
    const rollupInstance = new ProjectRollupInstance()
    rollupInstance.watch()
  }

  public static async create(){
    const creator = new ProjectCreator()
    return await creator.create()
  }

}