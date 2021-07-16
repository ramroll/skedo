import Command from "../interface/Command";
import config from '../config'
import fetch from "node-fetch";
import UI from "../helper/UI";

export default class List implements Command{
	name : string = 'list'
	format : string = "list"
	desc :string = "list components"

	async run(){

		const url = config.listUrl
		const json = await (await fetch(url)).json()
		const ui = UI.getUI()
		json.data.forEach((data : any) => {
			console.log(`component: ${data.group}.${data.type}`)
		})
	}

}