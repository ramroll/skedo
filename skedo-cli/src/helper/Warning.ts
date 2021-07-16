export default class WaringError {
	msg : string
	constructor(msg : string){
		this.msg = msg

	}

	toString(){
		return `${this.msg}`
	}
}