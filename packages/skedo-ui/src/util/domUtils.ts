export function domContains(a : Element, b : Element) : boolean {
	if(!b) {
		return false
	}
	if(b === a) {
		return true
	}

	return domContains(a, b.parentElement as Element)
}