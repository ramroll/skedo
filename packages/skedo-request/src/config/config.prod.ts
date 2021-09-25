import { ConfigAttributes } from "./ConfigAttributes";

const config : ConfigAttributes = {
	pageUrl: (user ? : string, name ? : string) => {
		if(!name) {
			return "https://api.weavinghorse.com/doc/page"
		}
		return `https://api.weavinghorse.com/doc/page/${user}/${name}`
	},
	uploadFileObject : "https://api.weavinghorse.com/upload/by-object",
	uploadFileText : `https://api.weavinghorse.com/upload/by-content`,
	componentUrl : (user ? : string, group? : string, name? : string) => {
		if(!group || !name || !user) {
			return "https://api.weavinghorse.com/doc/component "
		}
		return `http://api.weavinghorse.com/component/${user}/${group}/${name}`
	},
	codeProjectURL : (user : string, name : string) => {
		return `https://api.weavinghorse.com/doc/code-project/${user}/${name}` 
	},
	codeProjectBuildURL : (user : string, name : string) => {
		return `https://api.weavinghorse.com/runtime/build/${user}/${name}`
	}
}

export default config