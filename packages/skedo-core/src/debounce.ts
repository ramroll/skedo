declare type FN =(...args : Array<any>) => void 
export function debounce(fn : FN, delay : number = 300) {
	let I : any = null
	return (...args : Array<any>) => {
		I && clearTimeout(I)
		I = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}