import config from "../config";
import { fetchStandard } from "../standard";

export class PageService{
	public async put(user : string, name : string, url : string) {
		return await fetchStandard(config.pageUrl(user, name), {
			method : "PUT",
			headers : {
				'content-type' : 'application/json'
			},
			body : JSON.stringify({
				url 
			})
		})
	}

	public async get(user : string, name : string) {
		return await fetchStandard(config.pageUrl(user, name))
	}
}