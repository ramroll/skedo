import Command from "../interface/Command";
import UI from "../helper/UI";
import config from '../config'
import FatalError from "../helper/FatalError";
import {fetchJson} from '../helper/fetch'


export default class Delete implements Command{
	name : string = 'delete'
	format : string = "delete [group] [name]"
	desc :string = "delete component"
	ui :UI 

	constructor(){
		this.ui = UI.getUI()	
	}

	async run(argv : any){
		const name = argv.name
		const group = argv.group

		if(!name) {
			throw new FatalError("component name not specified.")	
		}

		if(!group) {
			throw new FatalError("component group not specified.")	
		}
		this.ui.start()
		this.ui.info("Delete Component")
		const Y = await this.ui.ask(`Are you sure to delete ${name}(Y)`)
		this.ui.end()
		if(Y !== 'Y') {
			return
		}
		
		const url = config.componentUrlWithName(group, name)
		const json = await fetchJson(url, {
			method : 'DELETE'
		})

		if(!json.success) {
			throw new FatalError(json.message)
		}
		this.ui.success("Success Delete Component.")
	}
}
