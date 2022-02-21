(() => {
	function isSet<T>(x : any) : x is Set<T> {
		return x instanceof Set
	}
	function add(a : number, b : number) : number;
	function add(a : string, b : string) : string;
	function add<T>(a : Set<T>, b : Set<T>) : Set<T>;

	function add<T>(a : T, b : T) : T{
			if(isSet<T>(a) && isSet<T>(b)){
				return new Set([...a, ...b]) as any
			}
			return (a as any) + (b as any)
	}

	const a = new Set<string>(["apple", "redhat"])
	const b = new Set<string>(["google", "ms"])
	console.log(add(a, b))
	console.log(add(1, 2))
	console.log(add("a", "k"))
})()