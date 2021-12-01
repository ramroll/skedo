import { FileNodeJson, FileType } from "./type";

export class FileTreeNode {
  private type: FileType
  private fileName: string

  private hidden : boolean = false

  // OSS (Object Storage Service)
  private url?: string

  private children: Array<FileTreeNode> = []

  // 文件内容
  private content?: string

  // 是否最新
  private dirty: boolean = false

  private parent? : FileTreeNode

  constructor(type: FileType, fileName: string, parent? : FileTreeNode) {
    this.type = type
    this.fileName = fileName
    this.parent = parent
  }

  public *getFiles(
    predicate: (file: FileTreeNode) => boolean
  ): Generator<FileTreeNode> {
    if(predicate(this)) {
      yield this
    }

    for (let child of this.children) {
      yield* child.getFiles(predicate)
    } 
  }

  public *getUpdates(): Generator<FileTreeNode> {
    if (this.dirty) {
      yield this
    }

    for (let child of this.children) {
      yield* child.getUpdates()
    }
  }

  public toJSON(): FileNodeJson {
    return {
      type: this.type,
      fileName: this.fileName,
      url: this.url || "",
      children: this.children.map((x) => x.toJSON()),
    }
  }

  public getParent(){
    return this.parent
  }

  public add(node: FileTreeNode) {
    const idx = this.children.findIndex(x => x.getName() === node.getName())
    if(idx === -1) {
      this.children.push(node)
    } else {
      this.children[idx] = node
    }
  }

  public setContent(content: string) {
    if (this.content !== content) {
      this.dirty = true
    }
    this.content = content
  }

  public getName() {
    return this.fileName
  }

  public getContent() {
    return this.content || ""
  }

  public getUrl() {
    return this.url!
  }

  public setUrl(url: string) {
    this.url = url
  }

  public getExt() {
    const prts = this.fileName.split(".")
    return (prts.length > 1 ? prts.pop() : "")|| ""
  }

  public getType() {
    return this.type
  }

  public getChildren() {
    const children = this.children.slice()
    children.sort((a, b) => {
      if(a.getType() === b.getType()) {
        return a.getName() < b.getName() ? -1 : 1
      }
      if(a.getType() === 'dir') {
        return -1
      }
      return 1
    })
    return children
  }

  public rename(name : string){
    if(!name || name === '' || name.trim() === '') {
      return
    }
    if(name === this.fileName) {
      return
    }
    this.fileName = name
    this.dirty = true
  }

  public updated() {
    this.dirty = false
  }

  public static fromJSON(obj: FileNodeJson, parent? : FileTreeNode) {
    const node = new FileTreeNode(obj.type, obj.fileName, parent)
    node.url = obj.url
    node.children = obj.children.map((x) =>
      FileTreeNode.fromJSON(x, node)
    )
    return node
  }

  public getLanguage() {
    switch (this.getExt()) {
      case "ts":
        return "typescript"
      case "json":
        return "json"
      case "js" :
        return "javascript"
      case "" :
        return "text"
      default:
        throw new Error("unknown ext type:" + this.getExt())
    }
  }
}