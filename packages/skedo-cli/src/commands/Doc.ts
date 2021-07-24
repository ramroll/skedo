import Command from "../interface/Command";
import UI from "../helper/UI";
import DocServer from "../helper/DocServer";

export default class Doc implements Command{
	name : string = 'doc'
	format : string = "doc [dir]"
	desc :string = "view markdown directory"
	ui :UI 

	constructor(){
		this.ui = UI.getUI()	
	}

	async run(argv : any){
		const server = new DocServer(argv.dir)
		server.start()
	}
}
