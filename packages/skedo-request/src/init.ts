type FetchFunction = (url : RequestInfo, init? :  RequestInit | undefined) => Promise<Response>
type FormDataConstructor = {
	new () : FormData
}


// @ts-ignore
export let fetch : FetchFunction = typeof global !== 'undefined' ? global.fetch : null

// @ts-ignore
export let FormData : FormDataConstructor = typeof global !== 'undefined' ?global.FormData  : null