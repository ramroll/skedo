import { Package } from "./package";
import fs from 'fs'
import path from "path";

class Packages {

	packages : Array<Package>

	ver : [number, number, number]
	marks :any 

	constructor(packages : Array<Package>){
		this.packages = packages.filter((x) => ['service', 'app', 'lib', 'cli'].indexOf(x.getSkedoType()) !== -1)


		// 版本号为最大的版本号
		const vers = packages.map(x => x.getVer())
			.sort((x, y) => {
				return (x[0] - y[0])*1000000 + (x[1] - y[1])*1000 + (x[2] - y[2])
			})
		this.ver = vers[0]
		this.loadMarks()
	}

	public increMinorVer(pkg : Package){
		const ver : [number, number, number] = [...this.ver]
		ver[1] ++
		pkg.setVer(ver)
	}

	public start(){
		if(!this.marks['installed']) {
			this.reinstall()
		}

		if(!this.marks['linked']) {
			this.installLinks()
		}

		this.find("@skedo/doc-service").startDev()
		this.find("@skedo/upload-service").startDev()
		this.find("@skedo/ui").startDev()

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

	public installLinks(){
		const links = new Set()
		this.packages.forEach(pkg => pkg.getDevLinks().forEach((link) => {
			if(!links.has(link)) {
				pkg.link()
			}
			links.add(link)
		}))

		this.packages.forEach(pkg => pkg.linkDev())
		this.marks["linked"] = true
		this.saveMark()
	}

	public reinstall() {
		this.packages.forEach(pkg => pkg.reNpmInstall())
		this.installLinks()
		this.packages.forEach(pkg => pkg.runBootstrapScript())

		this.marks['installed'] = true
		this.saveMark()
	}

	public loadMarks(){
		try{
			const content = fs.readFileSync(path.resolve(__dirname, "../../.skedo-mark"), 'utf8')
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

	}


}

export default Packages