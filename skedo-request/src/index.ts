import { ComponentService } from "./services/ComponentService";
import { FileService } from "./services/FileService";
import { PageService } from "./services/PageService";

export const fileRemote = new FileService()
export const componentRemote = new ComponentService()
export const pageRemote = new PageService()
export * from "./compose"