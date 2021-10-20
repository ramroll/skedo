declare type FN =(...args : Array<any>) => void 
export function throttle(fn : FN, interval = 13, defValue : any = null) {

	let open = true


	return (...args : Array<any>) => {
		if(open) {
			const result = fn(...args)
			open = false
			const ts = new Date().getTime()
			const mod = ts % interval
			setTimeout(() => {
				open = true 
			}, interval - mod)
			return result
		}
		return defValue 
	}
	
}