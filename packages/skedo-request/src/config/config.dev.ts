import { ConfigAttributes } from "./ConfigAttributes";


const uploadServiceURL = "http://localhost:7001"
const docServiceURL = "http://localhost:7002"
const buildServiceURL = "http://localhost:7004"

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