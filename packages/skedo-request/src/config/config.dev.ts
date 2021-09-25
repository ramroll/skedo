import { ConfigAttributes } from "./ConfigAttributes";

const config : ConfigAttributes = {
	pageUrl: (user? : string, name ? : string) => {
		if(!name || !user) {
			return "http://localhost:7002/page"
		}
		return `http://localhost:7002/page/${user}/${name}`
	},
	uploadFileObject : "http://localhost:7001/by-object",
	uploadFileText : `http://localhost:7001/by-content`,
	componentUrl : (user ? : string, group? : string, name? : string) => {
		if(!group || !name || !user) {
			return "http://localhost:7002/component "
		}
		return `http://localhost:7002/component/${user}/${group}/${name}`
	},
	codeProjectURL : (user : string, name : string) => {
		return `http://localhost:7002/code-project/${user}/${name}` 
	},
	codeProjectBuildURL : (user : string, name : string) => {
		return `http://localhost:7004/build/${user}/${name}`
	}
}

export default config