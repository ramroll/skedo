import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'


interface CustomResponse{
	success : boolean,
	message : string,
	errorCode? : number,
	statusCode : number,
	data? : any
}

export const fetchJson = async (
  url: RequestInfo,
  init?: RequestInit | undefined
): Promise<CustomResponse> => {

	if(!init) {
		init = {headers : {
		}}
	}
	if(!init.headers) {
		init.headers = {}
	}
	// @ts-ignore
	init.headers['content-type'] = 'application/json'

	const resp = await fetch(url, init)

	if(resp.status >= 200 && resp.status < 300) {
		const json = await resp.json()
		return json
	}

	return {
		success : false,
		statusCode : resp.status,
		message : "Server side error."
	}

}
