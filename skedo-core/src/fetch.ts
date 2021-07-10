export interface CustomResponse{
	success : boolean,
	message : string,
	errorCode? : number,
	httpCode : number,
	data? : any
}

type FetchFunction = (url : RequestInfo, init? :  RequestInit | undefined) => Promise<Response>
type FormDataConstructor = {
	new () : FormData
}

export const fetchJsonFactory = (fetch : FetchFunction) => {
  return async (
    url: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<CustomResponse> => {
    if (!init) {
      init = { headers: {} }
    }
    if (!init.headers) {
      init.headers = {}
    }
    // @ts-ignore
    init.headers["content-type"] = "application/json"

    const resp = await fetch(url, init)

    if (resp.status >= 200 && resp.status < 300) {
      const json = await resp.json()
			json.httpCode = resp.status
      return json
    }

    return {
      success: false,
      httpCode : resp.status,
      message: "Server side error.",
    }
  }
}

export const fetchUploadImageFactory = (fetch : FetchFunction, FormDataType : FormDataConstructor)  => {
	return async (
    url: RequestInfo,
		file : File, 
    init?: RequestInit | undefined
  ): Promise<CustomResponse> => {

		const data = new FormDataType()
		data.append("file", file)

		if(!init) {
			init = {}
		}
		init.body = data
    const resp = await fetch(url, init)

    if (resp.status >= 200 && resp.status < 300) {
      const json = await resp.json()
      return json
    }

    return {
      success: false,
      httpCode : resp.status,
      message: "Server side error.",
    }
  }
}