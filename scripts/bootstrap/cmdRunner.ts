import { exec, ExecOptions, execSync } from "child_process";
import chalk  from "chalk";
import { promisify } from "util";

// import detect from 'detect-character-encoding'

export function runCmd(command: string, options?: ExecOptions, silent = false) : Promise<void> {

	console.log(chalk.yellow('cwd(' + options.cwd + ")"))
	console.log(chalk.blueBright('run command>' + command))
	if(process.platform === 'win32') {
		command = '@chcp 65001 >nul & cmd /d/s/c ' + command
	}

	return new Promise((resolve, reject) => {
		try{
			const proc = exec(command, options)
	
			proc.stdout.on("data", (chunk:string) => {
				console.log(chunk)
			})
			proc.stderr.on("data", (chunk:string) => {
				console.log(chalk.red(chunk))
			})

			proc.on('close', () => {
				resolve()
			})

		}
		catch(ex) {
			if(silent) {
				console.log(ex.message)
				resolve()
				return
			}
			reject(ex)
		}
	})

}
