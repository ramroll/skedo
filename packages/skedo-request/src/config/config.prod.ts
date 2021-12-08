import { ConfigAttributes } from "./ConfigAttributes";

const uploadServiceURL = "https://api.weavinghorse.com"
const docServiceURL = "https://api.weavinghorse.com/doc"
const buildServiceURL = "https://api.weavinghorse.com/runtime"

const config : ConfigAttributes = {
	pageUrl: (user? : string, name ? : string) => {
		if(!name || !user) {
			return `${docServiceURL}/page`
		}
		return `${docServiceURL}/page/${user}/${name}`
	},
	uploadFileObject : `${uploadServiceURL}/by-object`,
	uploadFileText : `${uploadServiceURL}/by-content`,
	componentUrl : (user ? : string, group? : string, name? : string) => {
		if(!group || !name || !user) {
			return `${docServiceURL}/component`
		}
		return `${docServiceURL}/component/${user}/${group}/${name}`
	},
	codeProjectURL : (user : string, name : string) => {
		return `${docServiceURL}/code-project/${user}/${name}` 
	},
	codeProjectBuildURL : (user : string, name : string) => {
		return `${buildServiceURL}/build/${user}/${name}`
	}
}


export default config