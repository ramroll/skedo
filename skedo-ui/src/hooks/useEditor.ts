import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import EditorModel from "../object/EditorModel"
import {pageRemote, fileRemote, compose} from '@skedo/request'
import { boxDescriptor, NodeJsonStructure } from "@skedo/core"

const json : NodeJsonStructure = {
  type : "page",
  group : "basic",
	box : boxDescriptor({
		left : (3200-414)/2,	
		top : 40,
		width :414,
		height : 736,
		mode : 'normal'
	}),
  children : [
  ],
  style : {
    border : "1px solid #eee",
    backgroundColor : 'white'
  },
}

export default () : [EditorModel | null] => {
	const {page : pageName} = useParams<{[key : string] : string}>()
	const [editor, setEditor] = useState<EditorModel | null>(null)

	useEffect(() => {

		async function loadPage(){
			const svcCall = compose(pageRemote.get, fileRemote.get, data => {
				return [data.url]
			})
			const result = await svcCall(pageName)
			const page = JSON.parse(result.data)

			if(!page) {
				setEditor(new EditorModel(json, pageName))
			} else {
				setEditor(new EditorModel(page, pageName))
			}
		}

		loadPage()

	}, [])


	return [editor]

}