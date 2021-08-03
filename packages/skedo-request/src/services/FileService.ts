import config from '../config'
import {CustomResponse, fetchStandard} from '../standard'



export class FileService {

	async post1 (
		bucket: string,
		file: string,
		version: string,
		content: string
	) : Promise<CustomResponse> {
		// @ts-ignore
		const buffer = Buffer.from(content)
		const base64 = buffer.toString("base64")
		// const fileName = file.split("/").pop() || ""
		let ext = file.split('.').pop()
		if(ext === file) {
			ext ='' 
		}
		const first = file.replace(new RegExp("\\." + ext + "$"), "")
		const finalFileName = ext !== '' ? 
			`${bucket}/${first}-${version}.${ext}`
			: `${bucket}/${first}-${version}`

		return await fetchStandard(config.uploadFileText, {
			headers : {
				'content-type' : 'application/json' 
			},
			method : "POST",
			body : JSON.stringify({
				content: base64,
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
		} catch(ex) {
			return {
				message : ex.toString(),
				success : false,
				httpCode : resp ? resp.status : 400
			}
		}
	}
}
