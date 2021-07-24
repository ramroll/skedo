import {getScopeId} from './vue-proxy'
const cache = new Map<number, [any, Array<any>]>()

function eqArray(s1 : Array<any>, s2: Array<any>) {
	if(s1 === s2) {return true}
	if(!s1 || !s2 ) {return false}
	if (s1.length !== s2.length) return false;
	for(let i = 0; i < s1.length; i++) {
		if(s1[i] !== s2[i]) {
			return false
		}
	}
	return true
}

export function effect<T>(this : any, initializer : () => T, deps? : Array<any> | null) : T {
	return null
}

export function lexicalCache<T>(this : any, initializer : () => T, deps? : Array<any> | null) : T {
	if(!this || !this._closure_id) {
		throw new Error("please install babel-plugin-vue-lexical-cache first")
	}

	const id = (this._closure_id << 18) +  getScopeId()

	function evaluate(){
		const val = initializer()
		cache.set(id, [val, deps])
		return val
	}

	if(!cache.has(id)) {
		return evaluate()
	}

	const [oldValue, oldDeps] = cache.get(id)
	if(eqArray(oldDeps, deps)) {
		return oldValue
	}
	else {
		return evaluate()
	}
}


