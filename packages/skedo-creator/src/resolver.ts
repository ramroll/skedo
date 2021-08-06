import path from 'path'

export const projPathResolve = (relativePath : string) : string => {
  return path.resolve(process.cwd(), relativePath)
}
