import {fetch} from './init'
export interface CustomResponse{
	success : boolean,
	message? : string,
	errorCode? : number,
	httpCode : number,
	data? : any
}

export async function analyzeResponse(resp : Response){
  if(resp.status >= 200 && resp.status < 300) {
    try{
      return await resp.json()
    }
    catch(ex) {
      return {
        message : ex.toString(),
        success :false,
        httpCode : resp.status
      }
    }
  }

  if(resp.status >= 300 && resp.status < 400) {
    return {
      success : false,
      message : "Error: Redirection occured.",
      httpCode : resp.status
    }
  }

  else if(resp.status >= 400 && resp.status < 500) {
    return {
      success : false,
      message : "Error: Client side error occured.",
      httpCode : resp.status
    }
  }
  else {
    return {
      success : false,
      message : "Server side error occured.",
      httpCode : resp.status
    }
  }
}

export const fetchStandard = async (
    url: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<CustomResponse> => {
  return await analyzeResponse(await fetch(url, init))
}

