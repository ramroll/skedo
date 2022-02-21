
export function isIterator(obj : any) : obj is Iterator<any> {
	if(obj === null) {
		return false
	}
	// Narrowing
	return typeof obj[Symbol.iterator] === 'function'
}

// const id = yield * getUserId()
// const order = yield getOrders(id)

async function resolvePromise(promise : Promise<any>) {
	try {
		while(promise instanceof Promise) {
			promise = await promise 
		}
		return promise
	} catch(ex) {
		throw ex
	}
}

function runIterator(it : Iterator<any, any, any>, val : any = null) {
	const p = it.next(val)
	if(!p.done) {

		resolvePromise(p.value)
			.then(resolved => {
				runIterator(it, resolved)
			})
	}

}
export function asyncRunner(fn : () => Generator<any, any, any>) {
	const it = fn()

	if(isIterator(it)) {
		runIterator(it)
	}
}

function error(){
	throw new Error("this is an error.")
}

function takeAll(fn : () => Generator<any, any, any>) {
	return () => Promise.resolve([1,2,3])
}

function *t(){
	yield 1
	yield Promise.resolve(2) 
	yield 3
	yield 4
}

// asyncRunner(function * () {
// 	try{
// 		const x = yield 1
// 		const y = x + (yield 2)
// 		const z = y + (yield Promise.resolve(3))
// 		const w = z + (yield * t())
// 		const arr = yield takeAll(t)()
// 		console.log(w)
// 	} catch(ex) {
// 		console.log(ex)
// 	}
// })