import { FileTreeNode } from "./FileTreeNode"
import { ProjectJson, ProjectType } from "./type"


export class CodeProject {
  private name : string
  private type : ProjectType 
  private fileNode : FileTreeNode

  constructor(name : string, type : ProjectType) {
    this.name = name
    this.type = type
    this.fileNode = new FileTreeNode("dir", "root")
  }



  public toJSON (){

    return {
      name : this.name,
      type : this.type,
      fileTree : this.fileNode.toJSON()
    }
  }

  public setRootNode(node : FileTreeNode){
    this.fileNode = node
  }

  public getRootNode(){
    return this.fileNode
  }

  public getName(){
    return this.name
  }

  public static fromJSON(obj : ProjectJson) {
    const project = new CodeProject(obj.name, obj.type)
    const fileTree = FileTreeNode.fromJSON(obj.fileTree) 
    project.fileNode = fileTree
    return project
  }


}