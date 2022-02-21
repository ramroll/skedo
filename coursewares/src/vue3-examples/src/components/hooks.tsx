
import {Ref, ref, UnwrapRef} from 'vue'
type StateInitializer<S> = S | (() => S)

type Dispacher<S> = (v : S | ((prev : S) => S)) => void

type WithClosureID = {
	_closure : number
}

type Deps = Array<any>
let useStateFN : <S> (s : StateInitializer<S>) => [S, Dispacher<S>]
let useEffectFN : (effect : Function, deps : Deps)  => void
( () => {

	const map = new Map<number, any>()

	function fn__useState<S>(this : WithClosureID, s : StateInitializer<S>) :[S, Dispacher<S>] {
		const _closure = this._closure
		if(typeof s === 'function') {
			s = (s as () => S)()
		}

		// closure cache
		let refValue : Ref<UnwrapRef<S>>
		if(map.has(_closure)) {
			refValue = map.get(_closure)
		} else {
			refValue = ref<S>(s)
			map.set(_closure, refValue)
		}

		function setRefValue(v : S | ((prev : S) => S)) : void {
			if(typeof v === 'function') {
				v = (v as (prev : S) => S)(refValue.value as S)
			}
			refValue.value = (v as any)
		}

		return [refValue.value as S, setRefValue]
	}
	function eqSet(as : Set<any>, bs : Set<any>) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
	}

	function fn__useEffect(this : WithClosureID,fn : Function, deps : Array<any>) {
		const _closure = this._closure	
		
		if(!map.has(_closure)) {
			map.set(_closure, deps)
			fn()
			return
		}
		
		const oldDeps = map.get(_closure)
		const depsEqual = eqSet ( new Set(oldDeps), new Set(deps) ) 
		if(depsEqual) {
			return
		}
		fn()
		map.set(_closure, deps)
	}

	useStateFN = fn__useState
	useEffectFN = fn__useEffect

})()

export let useState = useStateFN
export let useEffect = useEffectFN