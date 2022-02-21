const p = new Proxy({
	a : 1
}, {
get(target, property, receiver) {
		console.log("get trap", ...arguments)
		return Reflect.get(receiver, property,receiver)      
}  
})
console.log(p.a)