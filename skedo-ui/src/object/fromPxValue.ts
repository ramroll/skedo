
export default function fromPxValue(val : string | number){
	if(typeof val === 'number') {
		return val
	}
	if(val.indexOf("%") !== -1) {
		return 0
	}
	else if(val.indexOf("px") !== -1) {
		val = val.replace("px", "")
		return Number.parseFloat(val)
	}else if(val.match(/^\d+$/)) {
		return Number.parseFloat(val)
	}
	else {
		throw new Error("Invalid length format.")
	}
}