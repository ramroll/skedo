import config from '../config'
import {CustomResponse, fetchStandard} from '../standard'
import md5 from 'md5'


export class FileService {

	async post1 (
		bucket: string,
		ext : string,
		content: string
	) : Promise<CustomResponse> {
		const hash = md5(content)
		const finalFileName = ext ? `${bucket}/${hash}.${ext}` : `${bucket}/${hash}`

		return await fetchStandard(config.uploadFileText, {
			headers : {
				'content-type' : 'application/json' 
			},
			method : "POST",
			body : JSON.stringify({
				content,
				file: finalFileName,
			})
		})
	}

	async post2(
		object : any 
	) : Promise<CustomResponse> {
		const form = new FormData()
		form.append("file", object)
		return await fetchStandard(config.uploadFileObject, {
			method: "POST",
			body: form,
		})
	}

	async get(url : string) : Promise<CustomResponse> {
		let resp : any = null
		try{
			resp = await fetch(url)
			const text = await resp.text()
			return {
				data : text,
				success : true,
				httpCode : resp.status
			}
		} catch(ex : any) {
			return {
				message : ex.toString(),
				success : false,
				httpCode : resp ? resp.status : 400
			}
		}
	}
}
