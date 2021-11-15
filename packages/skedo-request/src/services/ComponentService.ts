import config from '../config'
import { CustomResponse, fetchStandard } from '../standard'
export class ComponentService{
	external : ExternalComponentService
	constructor(){
		this.external = new ExternalComponentService()
	}

	public async get() : Promise<CustomResponse> {
		return await fetchStandard(config.componentUrl(), {
			headers : {
				'content-type' : 'application/json'
			}
		})
	}

	public async put(group : string, name : string, values : any) : Promise<CustomResponse> {
		return await fetchStandard(config.componentUrl('system', group, name), {
			method : 'PUT',
			headers : {
				'content-type' : 'application/json'
			},
			body : JSON.stringify(values)
		})
	}
}

class ExternalComponentService {
	get = async (url : string) : Promise<string> => {
		const resp = await fetch(url)
		return resp.text()
	}
}