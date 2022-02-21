
export function shallow(Target : any, copySymbols : Array<symbol> = []) {
	let deps = []
	class ProxyClass {
		constructor(...args : Array<any>){
			const inst = new Target(...args)


			const proxy = new Proxy(inst, {
				get : (inst: any, name : string) => {
					deps.push(name)
					return Reflect.get(inst, name)
				},
				set : (inst: any, name : string | symbol, value : any) => {
					Reflect.set(inst, name, value)
					return true
				}
			}) 
			Reflect.ownKeys(Object.getPrototypeOf(inst))
			.filter(x => typeof Reflect.get(Target.prototype, x) === 'function')
			.forEach(name => {
				if(name !== 'constructor') {
					const func = Reflect.get(Target.prototype, name)
					const fn = function(...args : Array<any>){
						deps = []
						const result = func.call(proxy, ...args)

						for(let key of deps) {
							const val = Reflect.get(inst, key)
							if(Array.isArray(val)) {
								Reflect.set(inst, key, val.slice())
							}
						}
						return result
					}
          for(let symbol of copySymbols) {
            fn[symbol] = func[symbol]
          }
					Reflect.set(Target.prototype, name, fn)
				}
			})

			return proxy
		}
	}

	return ProxyClass as typeof Target
}
