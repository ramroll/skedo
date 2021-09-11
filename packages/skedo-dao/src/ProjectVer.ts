import { Redis } from "./Redis";

const isDev = process.env.NODE_ENV === 'development'

export class ProjectVer {
  vers: Record<string, number> = {}

  private static inst: ProjectVer = new ProjectVer()

  public static getInst() {
    return ProjectVer.inst
  }

  private constructor() {}

  public async getVer(projectName: string) {
    if (isDev) {
      return this.vers[projectName] || 0
    } else {
      const client = await Redis.getInst().getClient()
      return await client.get("ver-" + projectName)
    }
  }

  public async incVer(projectName: string) {
    if (isDev) {
      this.vers[projectName] =
        (this.vers[projectName] || 0) + 1
    } else {
      const client = await Redis.getInst().getClient()
      await client.incr("ver-" + projectName)
    }
  }

  public async setVer(projectName: string, ver: number) {
    if (isDev) {
      this.vers[projectName] = ver
    } else {
      const client = await Redis.getInst().getClient()
      await client.set("ver-" + projectName, ver + "")
    }
  }
}