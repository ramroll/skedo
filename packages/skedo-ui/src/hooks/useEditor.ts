import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UIModel from "../object/UIModel"
import {pageRemote, fileRemote, compose} from '@skedo/request'
import { boxDescriptor, NodeJsonStructure, Topic } from "@skedo/meta"
import {ComponentsLoader} from '@skedo/loader'

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

const useEditor = (pageName : string) : [UIModel | null] => {
	
	const [editor, setEditor] = useState<UIModel | null>(null)

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
				setEditor(new UIModel(json, pageName))
			} else {
				const page = JSON.parse(result.data)
				setEditor(new UIModel(page, pageName))
			}
		}

		ComponentsLoader.get().on(Topic.RemoteComponentsLoaded)
			.subscribe(() => {
				loadPage()
			})

		ComponentsLoader.get().load()

	}, [])


	return [editor]

}

export default useEditor