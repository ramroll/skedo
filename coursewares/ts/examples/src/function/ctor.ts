(() => {

	type SomeConstructor<T> = {
		new (num: number): T 
	}

	function fn<T>(ctor: SomeConstructor<T>, n : number) {
    return new ctor(n)
	}
	
	const arr = fn<Array<string>>(Array, 100)
})()