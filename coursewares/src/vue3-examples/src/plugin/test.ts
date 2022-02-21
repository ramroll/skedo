import * as babel from "@babel/core"
import plugin from './babel-plugin-closure-id'


const code = `
import {ref, _createVNode} from 'vue'
import { lexicalScoped, effect }  from '@skedo/lexical-cache'

lexicalScoped('ref')

effect(() => {

}, [])

function foo(){
	ref(0)
	ref(0)
	ref(0)
	ref(0)
}

`

const result = babel.transformSync(code, {
	babelrc: false,
	ast: true,
	plugins : [plugin(null, null, null)],
	sourceMaps: true,
	sourceFileName: "aaa",
	configFile: false
})

console.log(result!.code)