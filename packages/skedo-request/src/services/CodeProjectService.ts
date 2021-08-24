import config from '../config'
import { CustomResponse, fetchStandard } from '../standard'

export class CodeProjectService {
  public async put(name : string, values : any) : Promise<CustomResponse> {
		return await fetchStandard(config.codeProjectURL(name), {
			method : 'PUT',
			headers : {
				'content-type' : 'application/json'
			},
			body : JSON.stringify(values)
		})
	}

	public async get(name : string) : Promise<CustomResponse> {
		return await fetchStandard(config.codeProjectURL(name), {
			method : 'GET',
			headers : {
				'content-type' : 'application/json'
			}
		})
	}
}