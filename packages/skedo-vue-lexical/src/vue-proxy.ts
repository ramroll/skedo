import {createVNode as _cv} from 'vue'


export {Fragment, mergeProps, createTextVNode, isVNode} from 'vue'
let scope = 0
let recursiveMark = 0


function wrapper(fn : any, obj : any, id : number){
	const wfn = function(...args : any) {
		scope = id 
		recursiveMark ++
		let arg1 : any = null
		if(obj?.children?.default) {
			arg1 = {
				slots : {
					default : obj.children.default
				}
			}
		}

		const vNode = fn(args[0], arg1)
		recursiveMark --
		return vNode
	} 
	return wfn.bind(obj)
}

let vNodeID = 1
export function createVNode(...args : Array<any>) {

	if(args.length > 1) {
	}

	// @ts-ignore
	const result = _cv(...args)

	if(typeof result.type === 'function') {
		result.type = wrapper(result.type, result, vNodeID)
	} 
	vNodeID ++
	return result
}

export function getScopeId(){
	return scope
}