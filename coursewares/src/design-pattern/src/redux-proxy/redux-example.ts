import {Action, createStore} from 'redux'

function shallow(Target : any) {
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
					Reflect.set(Target.prototype, name, fn)
				}
			})

			return proxy
		}
	}

	return ProxyClass as typeof Target
}


@shallow
class ToDoList {
	private list : string[] = [] 
	
	public add(todo : string){
		this.list.push(todo)
	}

	public getList(){
		return this.list
	}
}

function reducer(state = new ToDoList(), action : Action & {data : string}) {
	switch(action.type) {
		case 'add':
			state.add(action.data)
			break
		default:
	}
	return state
}
const store = createStore(reducer)

let list = store.getState().getList()
store.subscribe(() => {
	const state = store.getState()
	if(state.getList() !== list) {
		list = state.getList()
		console.log('list changed:', list)
	}
})

store.dispatch({
	type : 'add',
	data : Math.random() + ""
})

