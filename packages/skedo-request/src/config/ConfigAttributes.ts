export interface ConfigAttributes {
	pageUrl(name?: string) : string,
	uploadFileObject : string,
	uploadFileText: string,
	componentUrl : (group? : string, name? : string) => string,
	codeProjectURL : (name : string) => string
	codeProjectBuildURL : (name : string) => string

}