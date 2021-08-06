import {watch} from 'rollup'
import ProjectRollupConfig from "./ProjectRollupConfig";

export default class ProjectRollupInstance{

  public watch(){
    const config = new ProjectRollupConfig("dev")

    const watcher = watch(config.watchOptions())

    watcher.on('event', (e) => {
      switch(e.code) {
        case "ERROR":
          console.error(e.error)
          break
        case "START" :
          console.log("start watching...")
          break
        case "BUNDLE_END":
          console.log(e.output)
          break
      }
    })
    
  }
}