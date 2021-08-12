import fs from 'fs'
import path from 'path'
import Command from "../interface/Command"
import yaml from 'js-yaml'
import Question from '../helper/UI'
import * as Errors from '../helper/Errors'


const template = `
type : 
# 组件在skedo中展示的图片
image : 
title :  
initialWidth : 100
initialHeight : 100 
url : 
author : 
# 组件文件的源地址
src : 
version : 1.0.0
editor :
  groups:
  - name : example 
    title : 样例 
    props : 
    - name : src 
      label : 字号
      type : list<image-upload>
      path : passProps.imgs
`

/**
 * 初始化组件
 */
export default class Init implements Command{
	name : string = 'init'
	format : string = "init [groupAndName] [src]"
	desc :string = "init a component. e.g. \n" + "skedo init foo.bar ./components/A.vue"

	question : Question

	constructor(){
		this.question = new Question()
	}

	async run(argv : any){
		this.question.start()
		try{
			const groupAndName = argv.groupAndName
			const componentSourceFile = argv.src
			if(!componentSourceFile) {
				throw new Error("you should specify component source code file.")
			}
			if(!fs.existsSync(componentSourceFile)) {
				throw new Error(`file ${componentSourceFile} not found.`)
			}

			const ext = path.extname(componentSourceFile)
			if(['.tsx', '.ts', '.jsx', '.vue'].indexOf(ext) === -1) {
				throw new Error(`${ext} is not supproted.`)
			}
			if(!groupAndName) {
				throw new Error(Errors.GROUP_AND_NAME_NOT_SPECIFIED)
			}
			const [group, name] = groupAndName.split('.')
			this.question.title("begin init component : ", groupAndName)
			if(!(group && name)) {
				throw new Error(Errors.GROUP_AND_NAME_NOT_SPECIFIED)
			}
			await this.createYML(group, name, componentSourceFile)
		}finally {
			this.question.end()
		}
	}

	async createYML(group : string, name : string, src : string){

		const config : any = yaml.load(template)
		config.group = group
		config.src = src
		config.name = name
		const title = await this.question.ask("Input component title")
		config['title'] = title
		config['name']  = name

		let type = await this.question.ask("Which framework(react/vue)?(default react)")
		if(type === "") {
			type = "react"
		}
		if(! (type === 'react' || type === 'vue')) {
			throw new Error("Invalid component type:" + type)
		}
		config.type = type
		const str = yaml.dump(config)
		fs.writeFileSync(`./${name}.skedo.yml`, str, 'utf-8')

	}
}