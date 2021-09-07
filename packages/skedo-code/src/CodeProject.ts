import { FileTreeNode } from "./FileTreeNode"
import { ProjectJson, ProjectType } from "./type"


export class CodeProject {
  public static TemplateNames: {
    [key in ProjectType]: string
  } = {
    codeless: "codeless-template",
    faas: "faas-template",
  }

  // public static TemplateNames: Record<ProjectType, string> =
  //   {
  //     codeless: "codeless-template",
  //     faas: "faas-template",
  //   }

  private name: string
  private type: ProjectType
  private fileNode: FileTreeNode
  private scriptURL?: string

  constructor(name: string, type: ProjectType) {
    this.name = name
    this.type = type
    this.fileNode = new FileTreeNode("dir", "root")
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
      scriptURL: this.scriptURL,
      fileTree: this.fileNode.toJSON(),
    }
  }

  public setRootNode(node: FileTreeNode) {
    this.fileNode = node
  }

  public getRootNode() {
    return this.fileNode
  }

  public getName() {
    return this.name
  }

  public getType(){
    return this.type
  }

  public static fromJSON(obj: ProjectJson) {
    const project = new CodeProject(obj.name, obj.type)
    const fileTree = FileTreeNode.fromJSON(obj.fileTree)
    project.fileNode = fileTree
    project.scriptURL = obj.scriptURL
    return project
  }

  public setScriptURL(url: string) {
    this.scriptURL = url
  }

  public getScriptURL() {
    return this.scriptURL!
  }
}