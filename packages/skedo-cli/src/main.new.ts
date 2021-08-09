import yargsParser from "yargs-parser"
import figlet from "figlet"
import path from "path"
import fs from 'fs'
import chalk from "chalk"
import Command from "./interface/Command"
import FormData from 'form-data'
import fetch from 'node-fetch'


// @ts-ignore
global.fetch = fetch 

// @ts-ignore
global.FormData = FormData

const argv = yargsParser(process.argv)

console.log( figlet.textSync("SkEdO") )
let cmd = argv._[2]

function ucFirst(str :string) {
  const [a, ...others] = [...str]
  return a.toUpperCase() + others.join("")
}
function printHelper(){
  console.log(fs.readFileSync(path.resolve(__dirname, "./help.txt"), 'utf8'))
}
if(!cmd) {
  console.error(chalk.red("Command is needed!"))
  printHelper()
  process.exit(-1)
}

cmd = ucFirst(cmd)

async function run(){

  const module = './commands/' + cmd
  if(!fs.existsSync(path.resolve(__dirname, module + ".ts"))) {
    console.error(chalk.red(`Invalid command ${cmd}.`))
    return
  }
  const cmdClass = require('./commands/' + cmd ).default
  const inst : Command = new cmdClass()

  argv.groupAndName = argv._[3]

  try{
    await inst.run(argv)
  }catch(ex) {
    console.error(ex)
  }
}

run()