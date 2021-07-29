import { exec, ExecOptions, execSync } from "child_process";
import chalk  from "chalk";

// import detect from 'detect-character-encoding'

export function runCmd(command: string, options?: ExecOptions, silent = false) {

	console.log(chalk.yellow('cwd(' + options.cwd + ")"))
	console.log(chalk.blueBright('run command>' + command))
	if(process.platform === 'win32') {
		command = '@chcp 65001 >nul & cmd /d/s/c ' + command
	}
	try{
		const result = execSync(command, options)
		
		console.log(result.toString("utf8"))
	}
	catch(ex) {
		if(silent) {
			console.log(ex.message)
			return
		}
		throw ex
	}
}
