import { ConfigAttributes } from "./ConfigAttributes";

const config : ConfigAttributes = {
	pageUrl: (name ? : string) => {
		if(!name) {
			return "https://api.skedo.cn/doc/page"
		}
		return "https://api.skedo.cn/doc/page/" + name
	},
	uploadFileObject : "https://api.skedo.cn/upload/by-object",
	uploadFileText : `https://api.skedo.cn/upload/by-content`,
	componentUrl : (group? : string, name? : string) => {
		if(!group || !name) {
			return "https://api.skedo.cn/doc/component "
		}
		return "https://api.skedo.cn/doc/component/" + group + "/" + name 
	},
	codeProjectURL : (name : string) => {
		return `https://api.skedo.cn/doc/code-project/${name}` 
	},
	codeProjectBuildURL : (name : string) => {
		return `https://api.skedo.cn/runtime/build/${name}`
	}
}

export default config