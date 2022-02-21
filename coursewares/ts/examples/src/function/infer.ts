(() => {

	function map<Input, Output>(
		arr: Input[], 
		func: (arg: Input) => Output): Output[] {      
		return arr.map(func);
	}
	
	const parsed = map(["1", "2", "3"], (n) => parseInt(n))
	console.log(parsed)

	function add<T> (a : T, b : T ){
    return a + b
	}
})()