function printID(id : number | string) {
	if(typeof id === 'number') {
			console.log(id)
			return
	}
	console.log(id.toUpperCase())
}
printID("abc")