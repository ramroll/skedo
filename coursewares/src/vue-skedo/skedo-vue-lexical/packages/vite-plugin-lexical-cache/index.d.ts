import Plugin from 'vite'
declare function createPlugin(
	options : {
		names : Array<string>
	}
) : Plugin

export default createPlugin