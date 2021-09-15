import {CodeProject} from './CodeProject'
import {codeProjectRemote, fileRemote} from '@skedo/request'
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
    return project

  }

}