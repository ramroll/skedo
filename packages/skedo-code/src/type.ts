export type ProjectType = "codeless" | "faas"

export type FileType = "file" | "dir"


export type FileNodeJson = {
  type : FileType
  fileName : string
  url : string
  children : Array<FileNodeJson> 
}

export type ProjectJson = {
  name : string, 
  type : ProjectType,
  fileTree : FileNodeJson ,
  scriptURL: string,
  version : number
}