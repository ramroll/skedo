import { Package } from "./package";
import fs from 'fs'
import path from "path";
import { execSync } from "child_process";

class Packages {

	packages : Array<Package>
	package : Package

	ver : [number, number, number]
	marks :any 

	constructor(packages : Array<Package>){
		this.packages = packages.filter((x) => ['service', 'app', 'lib', 'cli'].indexOf(x.getSkedoType()) !== -1)
		this.package = new Package("package.json", path.resolve(__dirname, '../../')) 

		// 版本号为最大的版本号
		const vers = packages.map(x => x.getVer())
			.sort((x, y) => {
				return (x[0] - y[0])*1000000 + (x[1] - y[1])*1000 + (x[2] - y[2])
			})
		this.ver = vers[0]
		this.loadMarks()
	}

	public async increMinorVer(pkg : Package){
		const ver : [number, number, number] = [...this.ver]
		ver[1] ++
		pkg.setVer(ver)
	}

	public async publish(name : string, type : "major" | "minor" | "hotfix") {
		const pkg = this.packages.find(x => x.getName() === name)
		await pkg.buildES()
		await pkg.publish(type)
	}

	public async deps(){

		function depsCountMap(mDeps: Map<string,[number, string]>, deps : any){
			Object.keys(deps || {}).map(dep => {
				if(!mDeps.has(dep)) {
					mDeps.set(dep, [1, deps[dep]])
				} else {
					const x = mDeps.get(dep)
					mDeps.set(dep, [x[0] + 1, x[1]])
				}
			})
			return mDeps
		}

		const mDeps = new Map<string, [number, string]>()
		const mDevDeps = new Map<string, [number, string]>()
		this.packages.forEach(pkg => {
			if(pkg.isLocalInstall()) {
				return
			}
			const [deps, devDeps] = pkg.getDeps()
			depsCountMap(mDeps, deps)
			depsCountMap(mDevDeps, devDeps)
		})

		// this.packages.forEach(pkg => {
		// 	pkg.updateDeps(mDeps, mDevDeps)
		// })

		for (let key of mDeps.keys() ){
			if ( mDeps.get(key)[0] > 0 ) {
				const version = mDeps.get(key)[1]
				console.log("extract dep", key, version)
				this.package.setDep(key, version)
			}
		}
		for (let key of mDevDeps.keys() ){
			if ( mDevDeps.get(key)[0] > 0 ) {
				const version = mDevDeps.get(key)[1]
				console.log("extract dev dep", key, version)
				if(!this.package.hasDep(key)) {
					this.package.setDevDep(key, version)
				}
			}
		}

		this.package.save()

		for(let pkg of this.packages){
			await pkg.npmClear()
			if(pkg.isLocalInstall()) {

				await pkg.npmInstall()
			}
		}
	
		await this.package.npmInstall()

		await this.installLinks()

	}

	public switchLibsTo(type : 'es' | 'ts'){
		this.packages.filter(x => x.getSkedoType() === "lib")
			.forEach(lib => {
				if(type === 'es') {
					lib.toES()
				} else {
					lib.toTS()
				}
				lib.save()
			})
	}

	public async installDep(name : string, resolved : Set<string> = new Set()) {
		const pkg = this.packages.find(x => x.getName() === name)

		if(resolved.has(pkg.getName())) {
			return
		}

		for(let link of pkg.getDevLinks()) {
			await this.installDep(link, resolved)
		}

		await pkg.npmInstall()
		resolved.add(pkg.getName())


	}

	public async serve(name : string) {
		const pkg = this.packages.find(x => x.getName() === name)
		await pkg.serve()
	}

	public async build(name : string) {
		const pkg = this.packages.find(x => x.getName() === name)
		await pkg.build()
	}

	private getDeps(name : string, s = new Set<string>()) : Set<string> {

		const pkg = this.packages.find(x => x.getName() === name)
		s.add(pkg.getName())

		for(let link of pkg.getDevLinks()) {
			s.add(link)
			this.getDeps(link, s)
		}
		return s
	}

	
	public async buildTS(name? : string) {

		let pkgs : Array<Package>
		if(name) {
			const deps = this.getDeps(name)
			pkgs = this.packages.filter(x => deps.has(x.getName())) 
		} else {
			pkgs = this.packages.filter(x => x.getSkedoType() === 'lib') 
		}


		const resolved = new Set()

		while(resolved.size !== pkgs.length) {

			for(let pkg of pkgs) {

				if(resolved.has(pkg.getName())) {
					continue
				}

				if ( !pkg.getDevLinks().find(x => !resolved.has(x))  ) {
					await pkg.buildES()
					resolved.add(pkg.getName())
				}
			}

		}

	}

	public start(){

		if(!this.marks['installed']) {
			this.reinstall()
		}

		if(!this.marks['linked']) {
			this.installLinks()
		}

		this.packages.filter(x => x.getSkedoType() === 'service' || x.getSkedoType() === "app")
			.forEach(x => x.startDev())

	}

	public increMajorVer(pkg : Package){
		const ver : [number,number,number] = [...this.ver]
		ver[0] ++
		pkg.setVer(ver)
	}

	public increHotfixVer(pkg : Package){
		const ver : [number,number,number] = [...this.ver]
		ver[2] ++
		pkg.setVer(ver)
	}

	public setAllPackagesVerTo(ver : [number, number, number]) {
		this.packages.forEach(pkg => {
			pkg.setVer(ver)
			pkg.save()
		})
	}

	public listProjects(){
		this.packages.forEach(pkg => {
			console.log('<pkg ' + pkg.getName() + "@" + pkg.getVer().join('.') + '>') 
			console.log('  type', pkg.getSkedoType())
			console.log('  name', pkg.getName())
			console.log('  version', pkg.getVer().join('.'))
			console.log('  links', pkg.getDevLinks().join(' '))
		})
	}

	public saveAll(){
		this.packages.forEach(pkg => pkg.save())
	}

	public find(name : string) : (Package | null) {
		return this.packages.find(x => x.getName() === name)
	}

	public getRunnables(){
		return this.packages.filter(x => x.isRunnable())

	}

	private async installLink(name : string, level : number = 0) {

		const pkg = this.packages.find(x => x.getName() === name) 

		for(let link of pkg.getDevLinks()) {
			await this.installLink(link, level + 1)
		}
		await pkg.linkDev()

		if(level > 0) {
			await pkg.link()
		}


		
	}

	public async installLinks(name? : string){
		if(name) {
			this.installLink(name)
			return
		}
		const links = new Set()
		for(let pkg of this.packages) {
			for (let link of pkg.getDevLinks()) {
        if (!links.has(link)) {
          const pkgToLink = this.find(link)
          if (!pkgToLink) {
            throw new Error("Cannot find link:" + link)
          }
					// yark link
          await pkgToLink.link()
        }
        links.add(link)
      }

		}

		for(let pkg of this.packages) {
			// yarn link xxx
			await pkg.linkDev()
		}
		this.marks["linked"] = true
		this.saveMark()
	}

	public async npmClear(){
		for(let pkg of this.packages) {
			await pkg.npmClear()
		}
	}

	public async reinstall() {
		for(let pkg of this.packages) {
			await pkg.reNpmInstall()
		}
		await this.installLinks()
		await this.buildTS()
		// for(let pkg of this.packages) {
		// 	await pkg.runBootstrapScript()
		// }


		this.marks['installed'] = true
		this.saveMark()
	}

	public loadMarks(){
		try{
			const content = fs.readFileSync(path.resolve(__dirname, "../../.skedo"), 'utf8')
			const json = JSON.parse(content)
			this.marks = json
		} catch(ex){
			this.marks = {
			}
		}
	}

	public saveMark() {
		fs.writeFileSync(path.resolve(__dirname, "../../.skedo"), JSON.stringify(this.marks, null, 2), "utf-8")	
	}

	public install(){
		this.packages.forEach(pkg => pkg.npmInstall())
		this.installLinks()
		this.packages.forEach(pkg => pkg.runBootstrapScript())
		this.marks['installed'] = true
		this.saveMark()
	}


}

export default Packages