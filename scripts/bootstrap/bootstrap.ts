import { loadProjects } from "./scan"
import parser from 'yargs-parser'
import fs from 'fs'
import inquirer = require('inquirer')
import Packages from "./packages"
import { Package } from "./package"
import { resolve } from "path"
import chalk = require("chalk")

const argv = parser(process.argv.slice(2))
const cmd = argv._[0]


const projects = loadProjects()

async function run() {
  switch (cmd) {
    case "start":
      projects.start()
      break
    case "reinstall":
      projects.reinstall()
      break
    case 'clear':
      projects.npmClear()
      break
    case "install" :
      projects.install()
      break
    case "install-link":
      projects.installLinks(argv.name)
      break
    case "use-lib-es":
      projects.switchLibsTo('es')
      break
    case "use-lib-ts":
      projects.switchLibsTo('ts')
      break
    case "build-ts":
      projects.buildTS(argv.name)
      break
    case "build":
      projects.build(argv.name)
      break
    case "publish":
      projects.publish(argv.name, argv.type)
      break
    case "install-dep":
      projects.installDep(argv.name)
      break
    case "serve":
      projects.serve(argv.name)
      break
    case "dev":
      let name = argv.name
      if (!name) {
        console.error(chalk.red("You should specify project name."))
        printHelper()
        break
      }

      if(!name.match(/^@skedo/)) {
        name = '@skedo/' + name
      }

      let pkg = projects.find(name)
      if (!pkg) {
        
        name = await chooseProject(projects, `project ${name} not found, you may choose one from below.\n` )
        pkg = projects.find(name)
        break
      }

      pkg.startDev()
      break
    case "list":
      projects.listProjects()
      break
    case 'set-all-ver':
      const verStr = argv.ver
      if(!verStr) {
        console.log(chalk.red("version not specified."))
        printHelper()
        break
      }

      const ver = verStr.split('.').map(x => parseInt(x))

      if(ver.length !== 3 || ver.find(x => isNaN(x))) {
        console.log(chalk.red('version format error.'))
        break
      }

      projects.setAllPackagesVerTo(ver)
      break
    case 'help':
    default:
      printHelper()
      break
  }
}



function printHelper(){
  console.log(fs.readFileSync(resolve(__dirname, "./helpFile.txt"), 'utf-8'))
}

async function chooseProject(project : Packages, message : string) : Promise<(Package | null)>{

  const ret = await inquirer.prompt({
    name : "project",
    message,
    type : "list",
    choices:project.getRunnables().map(x => x.getName())
  })
  return project.find(ret["project"])
}

run()