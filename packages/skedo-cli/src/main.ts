#!/usr/bin/env ts-node 
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import FatalError from './helper/FatalError'
import UI from './helper/UI'
import WaringError from './helper/Warning'
import Command from './interface/Command'
import figlet from 'figlet'

import fetch from 'node-fetch'
import FormData from 'form-data'

// @ts-ignore
global.fetch = fetch
// @ts-ignore
global.FormData = FormData


// console.log(process.argv.slice(2))
process.argv[0] = "skedo"
async function parse() {

	console.log( figlet.textSync("skedo") )


  let y = yargs(process.argv.slice(2))
		.usage("Sketch And Do IT!")
    .usage("Usage: $0 <command> [options]")

	const cmds : {[key : string] : Command} = {}
	y = scan(y, cmds)
	const argv = y.argv
	// @ts-ignore
	const cmd = argv._[0]
	if(!cmd) {
		y.showHelp()
		return
	}
	const inst = cmds[cmd]

	try{
		await inst.run(argv) 
	}catch(ex) {
		const ui = UI.getUI()
		ui.error(ex.toString())
		console.log(ex.stack)
	}
}

function scan(y : yargs.Argv<{}>, cmds : {[key : string] : Command}) {
	const dir = path.resolve(__dirname, './commands')

	fs.readdirSync(dir)
		.forEach(file => {
			const [cmdName] = file.split('.')
			const CmdType = require(path.resolve(dir, file)).default
			const inst : Command = new CmdType()
			
			y = y.command(
				inst.format,
				inst.desc,
				(yargs) => {
					const argv = yargs.parseSync()
					cmds[inst.name] = inst
					return yargs
				}
			)
			
		})
	return y
}



parse()