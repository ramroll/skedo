import StateMachine from "./StateMachine";
import {CodeProject, CodeProjectRepo, FileTreeNode, ProjectJson, ProjectType} from '@skedo/code'
import { codeProjectRemote, fileRemote } from "@skedo/request";

export enum States{
  Initialize = 0,
  Selected
}

export enum Events{
  AUTO,
  Select
}

export enum Topic {
  SelectionChanged,
  Loaded
}

export class CodeEditorUI extends StateMachine<
  States,
  Events,
  Topic
> {
  private project: CodeProject
  private selectedFile?: FileTreeNode
  private loaded : boolean = false
  private type : ProjectType

  constructor(page : string, type : ProjectType) {
    super(0)
    this.type = type
    this.project = new CodeProject(page, "codeless")
    this.describe("这里是选中逻辑", () => {
      this.register(
        [States.Initialize, States.Selected],
        States.Selected,
        Events.Select,
        (node : FileTreeNode) => {
          this.selectedFile = node
          this.emit(Topic.SelectionChanged)
        }
      )
    })

    this.load()

    // @ts-ignore
    global.codeless = this
  }

  private async load(){

    /* 获取RDBMS */
    let result = await codeProjectRemote.get(this.project.getName())
    let copyFromTemplate = false
    if(!result.data) {
      result = await codeProjectRemote.get(CodeProject.TemplateNames[this.type])
      result.data.name = this.project.getName()
      copyFromTemplate = true
    }
    const json : ProjectJson = result.data
    this.project = CodeProject.fromJSON(json)

    /* 获取文件 */
    const files = [
      ...this.project
        .getRootNode()
        .getFiles((x) => x.getType() === "file"),
    ]

    for(let file of files) {
      const result = await fileRemote.get(file.getUrl())
      const content = result.data
      file.setContent(content)
      file.updated()
    }

    this.loaded = true
    if(copyFromTemplate) {
      await this.save()
    }
    this.emit(Topic.Loaded)
  }

  public getSelectedFile() {
    return this.selectedFile
  }

  public getJSON() {
    if(!this.loaded) {
      return null
    }
    return this.project.toJSON()
  }

  public getProject(){
    return this.project
  }

  public async save(){
    const repo = new CodeProjectRepo(this.project) 
    await repo.save()
  }

  public async build(){
    await codeProjectRemote.build.put(this.project.getName())
  }
}