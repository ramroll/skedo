import { ConfigAttributes } from "./ConfigAttributes";

const config : ConfigAttributes = {
	pageUrl: (name ? : string) => {
		if(!name) {
			return "http://localhost:7002/page"
		}
		return "http://localhost:7002/page/" + name
	},
	uploadFileObject : "http://localhost:7001/by-object",
	uploadFileText : `http://localhost:7001/by-content`,
	componentUrl : (group? : string, name? : string) => {
		if(!group || !name) {
			return "http://localhost:7002/component "
		}
		return "http://localhost:7002/component/" + group + "/" + name 
	},
	codeProjectURL : (name : string) => {
		return `http://localhost:7002/code-project/${name}` 
	},
	codeProjectBuildURL : (name : string) => {
		return `http://localhost:7004/build/${name}`
	}
}

export default config