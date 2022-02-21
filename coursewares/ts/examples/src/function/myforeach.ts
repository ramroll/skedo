(() => {

	function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
		for (let i = 0; i < arr.length; i++) {
			callback(arr[i], i);
		}
	}

	myForEach([1,2,3], (item, i) => {
		console.log(i?.toFixed())
	})
})()