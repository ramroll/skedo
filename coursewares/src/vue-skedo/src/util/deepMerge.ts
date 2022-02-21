function deepMergeArry(a : Array<any>, b : Array<any>) {
	return a.concat(b)
}

function deepMergeObject(a : any, b : any) {
	const obj : any = {...a}
	for(let key in b) {
		obj[key] = key in a ? deepMerge(a[key], b[key]) : b[key]
	}
	return obj
}

export function deepMerge(a : any, b : any){
	if(a === null || b === null) {
		return a || b 
	}

	if(typeof a !== 'object' && typeof b !== 'object') {
		return b
	}

	if(Array.isArray(a) && Array.isArray(b)) {
		return deepMergeArry(a, b)
	}
	return deepMergeObject(a, b)
}
