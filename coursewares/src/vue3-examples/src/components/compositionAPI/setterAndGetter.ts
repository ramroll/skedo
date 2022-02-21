
function track(){

}

function trigger(){

}
function createRef<T>(val : T){
	let _val : T  = val
	const refObj = {
		set value(v : T){
			console.log('setter called')
			if(_val !== v) {
				trigger()
				_val = 	v
			}
		},
		get value() {
			console.log('getter called')
			track()
			return _val
		}
	}
	return refObj
}

const a = createRef(0)
a.value = 10
a.value ++
console.log(a.value)



