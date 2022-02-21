import * as t from "@babel/types"
import BabelCore from '@babel/core'
import { ref } from "vue"


type Unwrap<T> = T extends (infer U)[] ? U : 
	(T extends Promise<infer V> ? V : T)

ref()
type T0 = Unwrap<Promise<string>>



const plugin = (api : any, options : any, dirname : any) => {
	return {
		name : "closure-id",
		visitor : {
			VariableDeclaration : {
				enter : (path : BabelCore.NodePath<t.VariableDeclaration>) => {
					const dec = path.node.declarations[0]
					const id : t.Identifier = dec.id as t.Identifier  
					id.name = "helper"
					console.log(id.name)
				} 
			}
		}
	}
}

export default plugin