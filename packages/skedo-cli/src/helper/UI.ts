import readline from 'readline'
import chalk from 'chalk'

export default class UI {

	private static inst : UI
	static getUI(){
		if(!UI.inst) {
			UI.inst = new UI()
		}
		return UI.inst
	}
	rl? : readline.Interface

	public start(){
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}

	public title(...msgs : Array<any>) {
		msgs = msgs.map(x => chalk.bold(chalk.yellow(x)))
		console.info(...msgs)
	}

	public ask(msg : string){
		if(!this.rl) {
			throw new Error("you should start() first")
		}
		const rl = this.rl
		return new Promise((resolve) => {
      rl.question(chalk.bold(msg + " :  "), (answer) => {
        resolve(answer)
      })
    })
	}

	success(msg : string) {
		console.info(chalk.green(' [succ] ' + msg))
	}

	info(msg : string){
		console.info(' [info] ' + msg)
	}
	
	public warning(msg : string) {
		console.info(chalk.grey(' [warn] ' + msg))
	}

	public error(msg : string) {
		console.info(chalk.bold(chalk.red('[fatal] ' + msg)))
	}

	public end(){
		this.rl?.close()
	}
}