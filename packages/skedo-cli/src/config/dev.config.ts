import { ConfigAttrs } from "./ConfigAttrs";

const conf : ConfigAttrs = {
	uploadImg : `http://localhost:7001/`,
	uploadOssUrl : `http://localhost:7001/component`,
	componentUrl : "http://localhost:7002/component",
	componentUrlWithName : (group, name) => {
		return "http://localhost:7002/component/" + group + "/" + name 
	},
	listUrl : "http://localhost:7002/components",



}

export default conf