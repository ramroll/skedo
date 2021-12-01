import StateMachine from "./StateMachine";
import {CodeProject, CodeProjectRepo, FileTreeNode, ProjectJson, ProjectType} from '@skedo/code'
import { codeProjectRemote, fileRemote } from "@skedo/request";

export enum States{
  Initialize = 0,
  Selected
}

export enum Events{
  AUTO,
  Select,
  NewFile,
  Rename
}

export enum Topic {
  SelectionChanged,
  Loaded,
  FileAdded,
  FileRenamed
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


    // 新增文件
    this.register(
      [States.Selected],
      States.Selected,
      Events.NewFile,
      () => {
        if(this.selectedFile) {
          if(this.selectedFile.getType() === "dir") {
            this.selectedFile.add(new FileTreeNode("file", "unnamed"))
          }
          else {
            this.selectedFile
              .getParent()
              .add(new FileTreeNode("file", "unnamed"))
          }

          this.emit(Topic.FileAdded)
        }
      }
    )

    // rename
    this.register(
      [States.Selected],
      States.Selected,
      Events.Rename,
      (filename : string) => {
        if(this.selectedFile) {
          this.selectedFile.rename(filename)
          this.emit(Topic.FileRenamed)
        }
      }
    )

    this.load()

    // @ts-ignore
    global.codeless = this
  }

  private async load(){

    /* 获取RDBMS */
    let result = await codeProjectRemote.get(
      localStorage["x-user"],
      this.project.getName()
    )
    let copyFromTemplate = false
    if(!result.data) {
      result = await codeProjectRemote.get(
        'template',
        CodeProject.TemplateNames[this.type]
      )
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
    await repo.save(localStorage['x-user'])
  }

  public async build(){
    await codeProjectRemote.build.put(
      localStorage['x-user'],
      this.project.getName()
      )
  }
}