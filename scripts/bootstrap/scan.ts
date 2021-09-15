import fs from 'fs'
import path from 'path'
import { Package } from './package'
import Packages from './packages'

function *walk(pattern : RegExp, dir : string, exclude : RegExp) : Generator<any> {

	const files = fs.readdirSync(dir)

	for(let i = 0; i < files.length; i++) {
		const file = files[i]
		const fullname = path.resolve(dir, file)
		if(fullname.match(exclude)) {
			continue
		}
		if(fullname.match(pattern)) {
			yield [file, dir]
		}
		if(fs.statSync(fullname).isDirectory()) {
			yield * walk(pattern, fullname, exclude)
		}
  }
}


// scan.ts
export function loadProjects() : Packages{
	const result = [...walk(/package\.json$/, path.resolve(__dirname, '../../'), /(node_modules|\.git)/)]
	return new Packages(result.map( ([file, dir]) => new Package(file, dir)))
}

// const packages = getPackageJsons()
// packages[0].save()