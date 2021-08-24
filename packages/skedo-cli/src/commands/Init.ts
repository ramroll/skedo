import fs from 'fs'
import path from 'path'
import Command from "../interface/Command"
import yaml from 'js-yaml'
import inquirer from 'inquirer'


const template = `
initialWidth : 100
initialHeight : 100 
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



	async run(argv : any){
		const sourceFile = argv.source
		if(!sourceFile)  {
			throw new Error("you should specify component source code file.")
		}
		if(!fs.existsSync(sourceFile)) {
			throw new Error(`file ${sourceFile} not found.`)
		}

		const ext = path.extname(sourceFile)
		if(['.tsx', '.ts', '.jsx', '.vue'].indexOf(ext) === -1) {
			throw new Error(`${ext} is not supproted.`)
		}

		const answer = await this.questions()
		answer.src = sourceFile

		await this.createYML(answer, sourceFile)

	}

	private async questions(){
		const result = await inquirer.prompt([
			{
        message: "select a group",
        choices: ["custom1", "custom"],
        type: "list",
        name: "group",
      },
      {
        message: "what's your component name? ",
        type: "input",
        name: "name",
      },
      {
        message: "what's your component tilte(display name)? ",
        type: "input",
        name: "title",
      },
      {
        message: "which framework? ",
        type: "list",
        name: "componentType",
				choices : ['react', 'vue']
      },
    ])
		return result
	}



	async createYML(answer : any, src : string){

		let config : any = yaml.load(template)
		config = {...config, ...answer}

		const str = yaml.dump(config)
		fs.writeFileSync(`./${config.name}.skedo.yml`, str, 'utf-8')

	}
}