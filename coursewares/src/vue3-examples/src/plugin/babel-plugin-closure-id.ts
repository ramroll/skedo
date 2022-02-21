import * as t from "@babel/types"
import BabelCore from '@babel/core'


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
	let pos = 0
	const plugin = (api : any, options : any, dirname : any) => {
		return {
			name : "closure-id",
			visitor : {
				Program : {
	
					enter(path : BabelCore.NodePath<t.Program>) {
						pos = 0
					},
					exit(path : BabelCore.NodePath<t.Program>) {
						scopedFunctionNames.clear()
					}
				},


				ImportDeclaration : {
					enter(path : BabelCore.NodePath<t.ImportDeclaration>) {
						const source = path.node.source.value
						if(source === 'vue') {
							const identifier = path.node.specifiers.find(x => x.local.name === '_createVNode')
							if(identifier) {
								path.node.source.value = "@skedo/vue-lexical-cache"
							}
						}
						else if(source === "@skedo/vue-lexical-cache") {
							const specifiers = path.node.specifiers
							const specifier = specifiers.find(x => x.local.name === 'lexicalCache')
							if(!specifiers.find(x => x.local.name === 'lexicalCache')) {
								specifiers.push(t.importSpecifier(t.identifier("lexicalCache"), t.identifier("lexicalCache")))
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
								if(path.node.callee.start! <= pos) {
									return
								}


								// ref(0)
								const calledExpr = path.node 

								if(calledExpr.callee.type === "Identifier" && calledExpr.arguments.length > 0) {
									if(calledExpr.arguments[0].type === 'ArrowFunctionExpression') {

										(calledExpr.callee as t.Identifier).name = "lexicalCache"
										path.replaceWith(bindClosureId(calledExpr))
										return
									}
								}


								// () => ref(0)
								const withArrow = t.arrowFunctionExpression(
									[],
									calledExpr
								)

								// lexicalCache(ref(0))
								const withLexicalCache = t.callExpression(
									t.identifier("lexicalCache"),
									[withArrow]
								)

								// lexicalCache.bind({_closure_id : number})(ref(0))
								const bindedExpr = bindClosureId(withLexicalCache)
								pos = path.node.callee.start!
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

let exportPlugin = createPlugin()
export default exportPlugin 