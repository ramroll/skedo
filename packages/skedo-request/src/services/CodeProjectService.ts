import config from '../config'
import { CustomResponse, fetchStandard } from '../standard'

export class CodeProjectService {
  public async put(user : string, name : string, values : any) : Promise<CustomResponse> {
		return await fetchStandard(config.codeProjectURL(user, name), {
			method : 'PUT',
			headers : {
				'content-type' : 'application/json'
			},
			body : JSON.stringify(values)
		})
	}

	public async get(user : string, name : string) : Promise<CustomResponse> {
		console.log('fetch---', config.codeProjectURL(user, name))
		return await fetchStandard(config.codeProjectURL(user, name), {
			method : 'GET',
			headers : {
				'content-type' : 'application/json'
			}
		})
	}

	build = new BuildService()
}

class BuildService {
	put = async (user : string, name : string) : Promise<CustomResponse> => {

		const resp = await fetchStandard(config.codeProjectBuildURL(user, name), {
			method : 'PUT'
		})
		return resp
	}
}