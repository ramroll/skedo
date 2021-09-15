import path from 'path'
import fs from 'fs'
type CopyOptions = {
  include : RegExp 
}

export function copy(src : string, target : string, options : CopyOptions){

  const files = fs.readdirSync(src)

  for(let file of files) {
    const stat = fs.statSync(path.resolve(src, file))
    if(stat.isDirectory()) {
      copy(
        path.resolve(src, file),
        path.resolve(target, file),
        options
      )
      continue
    }

    if(file.match(options.include)) {
      console.log('find file', file)
      
      if(!fs.existsSync(target)) {
        fs.mkdirSync(target, {
          recursive: true,
        })
      }
      fs.copyFileSync(
        path.resolve(src, file),
        path.resolve(target, file)
      )
    }

  }

}
