export function groupAndName(gAndN : string) {

	if(!gAndN) {
		throw new Error("Please specify group and name in [group].[name] format.")
	}
	const [group, name] = gAndN.split('.')
	if(!group || !name) {
		throw new Error("Please specify group and name in [group].[name] format.")
	}
	return [group, name]
}