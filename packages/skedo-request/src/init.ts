type FetchFunction = (url : RequestInfo, init? :  RequestInit | undefined) => Promise<Response>
type FormDataConstructor = {
	new () : FormData
}


// @ts-ignore
export let fetch : FetchFunction = global.fetch 

// @ts-ignore
export let FormData : FormDataConstructor = global.FormData 