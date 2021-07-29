import Editor from "@monaco-editor/react"


function foo(a : number, b : number) {
	return a + b
}

export default () => {
	return (
		<Editor
			theme="vs-dark"
			defaultLanguage="typescript"
			defaultValue={foo.toString()}
			options={{
				fontSize : 32
			}}
		/>
	)
}