import Editor from "@monaco-editor/react"

export default ({code, lang} : {code : string, lang : string}) => {
	return (
		<Editor
			theme="vs-dark"
			language={lang}
			defaultValue={code}
			options={{
				fontSize : 32
			}}
		/>
	)
}