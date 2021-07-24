export default class FatalError {
	msg : string
	constructor(msg : string){
		this.msg = msg
	}

	toString(){
		return `${this.msg}`
	}
}