import { CodeProjectService } from "./services/CodeProjectService";
import { ComponentService } from "./services/ComponentService";
import { FileService } from "./services/FileService";
import { PageService } from "./services/PageService";

export * from './standard'
export const fileRemote = new FileService()
export const componentRemote = new ComponentService()
export const pageRemote = new PageService()
export const codeProjectRemote = new CodeProjectService()
export * from "./compose"

export * as config from './config'