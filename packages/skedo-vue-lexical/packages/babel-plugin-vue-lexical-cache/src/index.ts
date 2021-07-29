import * as t from "@babel/types"
import * as BabelCore from '@babel/core'


const createPlugin = () => {

	const scopedFunctionNames = new Set()

	let id_base = 1
	function bindClosureId(expr : t.CallExpression) : t.CallExpression {

		if(expr.callee.type === 'MemberExpression') {
			return expr
		}
	
		// lexicalCache -> lexicalCache.bind
		const memberExpr = t.memberExpression(expr.callee as t.Identifier, t.identifier("bind"))
	
		// ({_closure_id : number })
		const obj = t.objectExpression([t.objectProperty(t.identifier("_closure_id"), t.numericLiteral(id_base++))])

		// call bind
		const callBindExpr = t.callExpression(memberExpr, [obj])

		// call original arguments
		return t.callExpression(callBindExpr, expr.arguments)
	}

	let enterCounter = 0
	const plugin = (api : any, options : any, dirname : any) => {
		return {
			name : "closure-id",
			visitor : {
				Program : {
	
					enter(path : BabelCore.NodePath<t.Program>) {
						if(enterCounter ++ == 2) {
							throw "exit"
						}
					},
					exit(path : BabelCore.NodePath<t.Program>) {
						scopedFunctionNames.clear()
					}
				},


				ImportDeclaration : {
					enter(path : BabelCore.NodePath<t.ImportDeclaration>) {
						const source = path.node.source.value
						if(source === 'vue') {
							const identifier = path.node.specifiers[0].local
							if(identifier.name === '_createVNode') {
								path.node.source.value = "@skedo/lexical-cache"
							}
						}
					}
				},
				CallExpression : {
					enter(path : BabelCore.NodePath<t.CallExpression>) {
	
	
						if('name' in path.node.callee) {
	
							const name = path.node.callee.name

							if(name === 'lexicalScoped') {
								// scoped("ref", "reactive") => ["ref", "reactive"] => set 
								path.node.arguments.map( x => (x as t.StringLiteral).value)
									.forEach(x => scopedFunctionNames.add(x))
							}
							else if(scopedFunctionNames.has(name)) {

								// ref(0)
								const calledExpr = path.node

								// lexicalCache(ref(0))
								const withLexicalCache = t.callExpression(
									t.identifier("lexicalCache"),
									[calledExpr]
								)

								// lexicalCache.bind({_closure_id : number})(ref(0))
								const bindedExpr = bindClosureId(withLexicalCache)
								path.replaceWith(bindedExpr)
							} else if(name === 'lexicalCache') {
								path.replaceWith(bindClosureId(path.node))
							}
						}
					}
				}
			}
		}
	}

	return plugin
	
}

export default createPlugin() 