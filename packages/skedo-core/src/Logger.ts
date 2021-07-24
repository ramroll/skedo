export class Logger {
	topic : string

	constructor(topic : string){
		this.topic = `[${topic}] `
	}

	debug(...args : Array<any>) {
		console.debug(this.topic, ...args)
	}
	log(...args : Array<any>) {
		console.log(this.topic, ...args)
	}

}