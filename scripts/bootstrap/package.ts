import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import R from 'ramda'
import {runCmd} from './cmdRunner'
import {copy} from './copy'

interface PackageJSON{
	name : string,
	version : [number, number, number],
	main : string,
	skedo? : {
		devLinks? : string[],
		type? : "service" | "app" | "lib" | "cli",
		port? : number,
		bootstrap ? : string,
		localInstall? : boolean
	},
	dependencies : {
		[dep : string] : string
	},
	devDependencies: {
		[dep : string] : string
	},
}
export class Package{

	private json : PackageJSON
	private fullname : string
	private dir : string
	private dirty : boolean = false

	constructor(file : string, dir : string){
		this.fullname = path.resolve(dir, file) 
		const _json = this.parseJSON(fs.readFileSync(this.fullname, 'utf-8')) 
		this.dir = dir
		
		if(_json.version) {
			_json.version = _json.version.split('.').map(x => parseInt(x))
		}

		this.json = _json
	}

	private parseJSON(str){
		try{
			return JSON.parse(str)
		}catch(ex) {
			console.error("parse json error @" + this.fullname)
			throw ex
		}
	}

	public isRunnable() {
		return ['app', 'service'].indexOf(this.getSkedoType()) !== -1
	}

	public setVer(ver : [number, number, number]) {
		this.json.version = ver
		this.dirty = true
	}
	
	public getVer() {
		return this.json.version
	}

	public getSkedoType(){
		return this.json.skedo?.type
	}

	public getDevLinks(){
		return (this.json.skedo?.devLinks) || []
	}

	public async publish(type : "major" | "minor" | "hotfix"){
		const ver = this.getVer()
		switch(type) {
			case "major":
				ver[0]++
				this.setVer([...ver])
				break
			case "minor":
				ver[1] ++
				this.setVer([...ver])
				break
			case "hotfix":
				ver[2] ++
				this.setVer([...ver])
				break
			default:
				throw new Error("unsupported type")
		}
		this.save()

		await this.exec("npm publish")
	}

	public toES(){
		this.dirty = true
		this.json.main = 'es/index.js'
	}

	public toTS(){
		this.dirty = true
		this.json.main = 'src/index.ts'
	}

	public save() {
		if(!this.dirty) {
			return
		}
		const _json : any = R.clone(this.json)
		_json.version = this.json.version.join('.')
		const content = JSON.stringify(_json, null, 2)
		fs.writeFileSync(this.fullname, content, 'utf-8')
	}

	private async exec(cmd : string, silent = false, envs : any = {}) {
		await runCmd(cmd, {
			// windowsHide: true,
			env : {
				...process.env,
				...envs
			},
			cwd: this.dir,
		}, silent)
	}

	public async link(){
		console.log(chalk.cyanBright(`link ${this.getName()}`))
		if(this.getSkedoType() !== 'cli') {
			await this.exec('yarn unlink')
			await this.exec('yarn link')
		} else {
			await this.exec("npm link --force")
		}
	}


	public getDeps(){
		return [this.json.dependencies,this.json.devDependencies]
	} 

	public updateDeps(mDeps : Map<string, [number, string]>, mDevDeps : Map<string, [number, string]>){
		for(let key in this.json.dependencies) {
			if(mDeps.get(key)[0] > 1) {
				console.log('delete', key)
				// delete this.json.dependencies[key]
			}
		}
		for(let key in this.json.devDependencies) {
			if(mDevDeps.get(key)[0] > 1) {
				console.log('delete', key)
				// delete this.json.dependencies[key]
			}
		}
	}

	public async npmInstall(){
		await this.exec('yarn install')
	}

	public async npmClear(){
		// await this.exec("pm2 stop all", true)
		// await this.exec("pm2 delete all", true)
		await this.exec("rm -rf ./package-lock.json", true)
		await this.exec("rm -rf ./node_modules", true)
	}

	public async reNpmInstall(){
		await this.npmClear()	
		await this.npmInstall()
	}

	public async runBootstrapScript(){
		if(this.json.skedo?.bootstrap) {
			await this.exec(`ts-node ${this.json.skedo.bootstrap}`)
		}
	}

	public getName(){
		return this.json.name
	}

	public async linkDev(){
		for(let link of this.getDevLinks()) {
			await this.exec(`yarn link ${link}`)
		}
	}

	public async startDev(){

		switch (this.getSkedoType()) {
      case "app": {
				const script = path.resolve(__dirname, './start-service.js')
				await this.exec(
          `pm2 start --name ${this.getName()} --watch=true --exp-backoff-restart-delay=10000 ${script}`,
          true
        )
				// await this.exec('npm run dev')
        break
			}
      case "service": {
				if(!this.json.skedo?.port) {
					console.error(chalk.red(`you should specify port number in your package.json with skedo.port=xxx.`))
					break
				}
				const script = path.resolve(__dirname, './start-service.js')
				await this.exec(`pm2 start --name ${this.getName()} --exp-backoff-restart-delay=10000 ${script}`, true, {
					PORT : this.json.skedo.port
				})
				await this.exec(`pm2 list`)
        break
			}
      default:
				console.error(chalk.red(`you cannot start an [${this.getSkedoType}] type package.`))
				break
    }
		
	}

	public async buildES(){
		if(["app", "cli"].indexOf( this.getSkedoType()) !== -1) {
			return
		}

		console.log(chalk.bold(chalk.yellow("build:" + this.getName())))
		
		await this.exec("tsc")

		console.log('copy static files',)
		copy(
      path.resolve(this.dir, "src"),
      path.resolve(this.dir, "es"),
			{
				include : /.(scss|css|jpg|jpeg|yml|json)$/
			}
    )
	}

	public setDep(key : string, version :string) {
		this.dirty = true
		this.json.dependencies[key] = version
	}
	public setDevDep(key : string, version :string) {
		this.dirty = true
		this.json.devDependencies[key] = version
	}

	public hasDep(key : string) {
		return !!this.json.dependencies[key]
	}

	public isLocalInstall(){
		return this.json.skedo?.localInstall
	}

	public async build(){
		await this.exec("npm run build")
	}
	public async serve(){
		await this.exec('npm run serve')
	}

}