import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import EditorModel from "../object/EditorModel"
import {pageRemote, fileRemote, compose} from '@skedo/request'
import { boxDescriptor, NodeJsonStructure } from "@skedo/core"

const json : NodeJsonStructure = {
  type : "react",
	name : "page",
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
				if(!data) {
					return false
				}
				return [data.url]
			})
			const result = await svcCall(pageName)

			if(!result.success) {
				setEditor(new EditorModel(json, pageName))
			} else {
				const page = JSON.parse(result.data)
				setEditor(new EditorModel(page, pageName))
			}
		}

		loadPage()

	}, [])


	return [editor]

}