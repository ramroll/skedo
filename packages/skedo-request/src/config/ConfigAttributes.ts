export interface ConfigAttributes {
	pageUrl(user ? : string, name?: string) : string,
	uploadFileObject : string,
	uploadFileText: string,
	componentUrl : (user?: string, group? : string, name? : string) => string,
	codeProjectURL : (user : string, name : string) => string
	codeProjectBuildURL : (user : string, name : string) => string

}