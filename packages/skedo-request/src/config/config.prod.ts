import { ConfigAttributes } from "./ConfigAttributes";

const config : ConfigAttributes = {
	pageUrl: (name ? : string) => {
		if(!name) {
			return "https://api.weavinghorse.com/doc/page"
		}
		return "https://api.weavinghorse.com/doc/page/" + name
	},
	uploadFileObject : "https://api.weavinghorse.com/upload/by-object",
	uploadFileText : `https://api.weavinghorse.com/upload/by-content`,
	componentUrl : (group? : string, name? : string) => {
		if(!group || !name) {
			return "https://api.weavinghorse.com/doc/component "
		}
		return "https://api.weavinghorse.com/doc/component/" + group + "/" + name 
	},
	codeProjectURL : (name : string) => {
		return `https://api.weavinghorse.com/doc/code-project/${name}` 
	},
	codeProjectBuildURL : (name : string) => {
		return `https://api.weavinghorse.com/runtime/build/${name}`
	}
}

export default config