import { ConfigAttrs } from "./ConfigAttrs";

const uploadServiceURL = "http://localhost:/7001"
const docServiceURL = "http://localhost:7002"

const conf : ConfigAttrs = {
	uploadImg : `${uploadServiceURL}`,
	uploadOssUrl : `${uploadServiceURL}/component`,
	componentUrl : `${docServiceURL}/component`,
	componentUrlWithName : (group, name) => {
		return `${docServiceURL}/component/" + group + "/" + name `
	},
	listUrl : `${docServiceURL}/components`,
}

export default conf