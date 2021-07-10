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
}

class ExternalComponentService {
	get = async (url : string) : Promise<string> => {
		const resp = await fetch(url)
		return resp.text()
	}
}