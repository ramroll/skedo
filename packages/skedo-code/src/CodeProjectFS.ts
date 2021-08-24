import fs from 'fs'
import path from 'path'
import { CodeProject } from "./CodeProject"
import { FileTreeNode } from "./FileTreeNode"
import {codeProjectRemote, fileRemote} from '@skedo/request'
import { ProjectJson } from './type'

export class CodeProjectFS {
  private cwd : string
  constructor(cwd : string){
    this.cwd = cwd
  }

  private createFileNode(dir : string, name = "") : FileTreeNode{
    const files = fs.readdirSync(dir)

    const fNode = new FileTreeNode("dir", name)

    for(let file of files) {
      const fullName = path.resolve(dir, file)
      if(fs.statSync(fullName).isDirectory()) {
        fNode.add(this.createFileNode(fullName, file))
      } else {
        const fileNode = new FileTreeNode("file", file)
        fileNode.setContent(fs.readFileSync(fullName, 'utf8'))
        fNode.add(fileNode)
      }
    }
    return fNode

  }

  public async upload(project : CodeProject) {

    const fileNode = this.createFileNode(this.cwd)

    project.setRootNode(fileNode)
    const filesToUpload = [...fileNode.getUpdates()]

    /* 逐个上传 */
    for(let file of filesToUpload) {
      const result = await fileRemote.post1(
        "/code",
        file.getExt(),
        file.getContent()
      )
      file.setUrl(result.data)
      file.updated()
    }

    /* 上传项目的JSON */
    const json = project.toJSON()
    console.log(JSON.stringify(json, null, 2))
    await codeProjectRemote.put(project.getName(), json)

    console.log(await codeProjectRemote.get(project.getName()))

  }

  private async downloadFile(base : string, node : FileTreeNode){

    if(node.getType() === "dir") {
      if(fs.existsSync(path.resolve(base, node.getName()))) {
				fs.rmdirSync(path.resolve(base, node.getName()), {
					recursive : true
				})
			}
      fs.mkdirSync(path.resolve(base, node.getName()))

      for(let child of node.getChildren()) {
        await this.downloadFile(path.resolve(base, node.getName()), child)
      }
      return
    }

    /* 下载文件内容到磁盘 */
    const url = node.getUrl()
    const result = await fileRemote.get(url)
    const content = result.data
    node.setContent(content)
    node.updated()

    fs.writeFileSync(
      path.resolve(base, node.getName()),
      content,
      "utf8"
    )

  }

  public async download(name : string){
    /* 从RDBMS中获取项目 */
    const result = await codeProjectRemote.get(name)
    const json : ProjectJson = result.data
    const project = CodeProject.fromJSON(json)

    /* 将文件下载到本地磁盘并创建对应的目录结构 */
    await this.downloadFile(this.cwd, project.getRootNode())
    return project
  }



  // public async download() : Promise<CodeProject> {

  // }
}