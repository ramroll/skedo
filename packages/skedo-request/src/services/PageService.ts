import config from "../config";
import { fetchStandard } from "../standard";

export class PageService{
	public async put(name : string, url : string) {
		return await fetchStandard(config.pageUrl(name), {
			method : "PUT",
			headers : {
				'content-type' : 'application/json'
			},
			body : JSON.stringify({
				url 
			})
		})
	}

	public async get(name : string) {
		return await fetchStandard(config.pageUrl(name))
	}
}