export interface ConfigAttrs {
	uploadOssUrl: string,
	componentUrl : string,
	uploadImg : string,
	componentUrlWithName : (group : string, name : string) => string,
	listUrl : string
}