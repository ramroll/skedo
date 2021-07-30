import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import R from 'ramda'
import {runCmd} from './cmdRunner'

interface PackageJSON{
	name : string,
	version : [number, number, number],
	skedo? : {
		devLinks? : string[],
		type? : "service" | "app" | "lib" | "cli",
		port? : number,
		bootstrap ? : string
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

	public save() {
		if(!this.dirty) {
			return
		}
		const _json = R.clone(this.json)
		_json.version = this.json.version.join('.')
		const content = JSON.stringify(_json, null, 2)
		fs.writeFileSync(this.fullname, content, 'utf-8')
	}

	private exec(cmd : string, silent = false, envs : any = {}) {
		runCmd(cmd, {
			// windowsHide: true,
			env : {
				...process.env,
				...envs
			},
			cwd: this.dir,
		}, silent)
	}

	public link(){
		console.log(chalk.cyanBright(`link ${this.getName()}`))
		this.exec('yarn link')
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

	public npmInstall(){
		this.exec('yarn install')
	}


	public reNpmInstall(){
		this.exec("pm2 stop all", true)
		this.exec("pm2 delete all", true)
		this.exec("rm -rf ./package-lock.json", true)
		this.exec("rm -rf ./node_modules", true)
		this.npmInstall()
	}

	public runBootstrapScript(){
		if(this.json.skedo?.bootstrap) {
			this.exec(`ts-node ${this.json.skedo.bootstrap}`)
		}
	}

	public getName(){
		return this.json.name
	}

	public linkDev(){

		this.getDevLinks().forEach((link) => {
			this.exec(`yarn link ${link}`)
		})
	}

	public startDev(){

		switch (this.getSkedoType()) {
      case "app": {
				const script = path.resolve(__dirname, './start-service.js')
				this.exec(
          `pm2 start --name ${this.getName()} --watch=true ${script}`,
          true
        )
				// this.exec('npm run dev')
        break
			}
      case "service": {
				if(!this.json.skedo?.port) {
					console.error(chalk.red(`you should specify port number in your package.json with skedo.port=xxx.`))
					break
				}
				const script = path.resolve(__dirname, './start-service.js')
				this.exec(`pm2 start --name ${this.getName()} --watch=true ${script}`, true, {
					PORT : this.json.skedo.port
				})
				this.exec(`pm2 list`)
        break
			}
      default:
				console.error(chalk.red(`you cannot start an [${this.getSkedoType}] type package.`))
				break
    }
		
	}
}