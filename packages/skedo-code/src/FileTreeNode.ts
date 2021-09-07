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

  constructor(type: FileType, fileName: string) {
    this.type = type
    this.fileName = fileName
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

  public add(node: FileTreeNode) {
    this.children.push(node)
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
    return this.children
  }

  public updated() {
    this.dirty = false
  }

  public static fromJSON(obj: FileNodeJson) {
    const node = new FileTreeNode(obj.type, obj.fileName)
    node.url = obj.url
    node.children = obj.children.map((x) =>
      FileTreeNode.fromJSON(x)
    )
    return node
  }

  public getLanguage() {
    switch (this.getExt()) {
      case "ts":
        return "typescript"
      case "json":
        return "json"
      default:
        throw new Error("unknown ext type:" + this.getExt())
    }
  }
}