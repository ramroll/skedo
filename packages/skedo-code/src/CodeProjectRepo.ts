import {CodeProject} from './CodeProject'
import {codeProjectRemote, fileRemote} from '@skedo/request'
import {ProjectVer} from '@skedo/dao'
export class CodeProjectRepo {
  project : CodeProject 

  constructor(project : CodeProject) {
    this.project = project
  }

  public async save(){

    let updated = false
    for(let update of this.project.getRootNode().getUpdates()) {
      const result = await fileRemote.post1(
        "/codeless",
        update.getExt(),
        update.getContent()
      )
      update.setUrl(result.data)
      update.updated()
      updated = true
    }

    if(updated) {
      this.project.incrVer()
      // 在Redis处更新版本
      await ProjectVer.getInst().incVer(this.project.getName())
    }

    await codeProjectRemote.put(
      this.project.getName(),
      this.project.toJSON()
    )

    console.log('project saved.', this.project.toJSON())

  }

  public static async load(name : string) {
    
    const result = await codeProjectRemote.get(name)
    const project = CodeProject.fromJSON(result.data)
    // 回写Redis版本
    await ProjectVer.getInst().setVer(name, project.getVersion())
    return project

  }

}