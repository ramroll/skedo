import util from 'util'
function createReactive(obj : any) {

	return new Proxy(obj, {
		get : (target, name, receiver) => {
			console.log('get value', name, target)
			console.log('isProxy', util.types.isProxy(target))
			if(name === 'c') {
				return "this is a proxy value"
			}

			return Reflect.get(target, name, receiver )
		},
		set : (target, name, value, receiver) :boolean => {
			if(!(name in target)) {
				return false
			}

			Reflect.set(target, name, value, receiver)
			console.log('set value to', value, receiver)
			return true
		}


	})
}

const o = createReactive({
	a : 1,
	b : 2,
	foo : function() {
		console.log('a is', this.a)
	},
	get bar(){
		return this.c
	}
})

// console.log('o is proxy ? ' , util.types.isProxy(o))

// o.a = 100 
// console.log(o.c)
console.log(o.bar)
