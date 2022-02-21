(() => {

	function minimumLength<Type extends { length: number  }>(
		obj: Type,
		minimum: number
	): Type {
		if (obj.length >= minimum) {
			return obj;
		} else {
			// return new typeClass(minimum)
			return obj.constructor(minimum)
		}
	}

	
	minimumLength(new Array<string>(100), 1000)
	

})()