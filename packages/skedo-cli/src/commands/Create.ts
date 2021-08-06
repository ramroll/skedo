import Command from "src/interface/Command";
import inquirer from "inquirer";
import chalk from "chalk";

export default class Create implements Command{

  name : string = "create"
  format : string = "create"

  async run(argv : any){
    const projectType = await this.askProjectType()
    console.log(chalk.greenBright(`You choose ${projectType}`))
  }

  async askProjectType(){
    const result = await inquirer.prompt({
      name : "type",
      message : "Please select a project type:",
      default: "react+ts",
      type: "list",
      choices : [
        "react+ts",
        "vue+ts"
      ]
    })

    return result.type
  }
}