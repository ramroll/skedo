import { useEffect, useState } from "react"
import UIModel from "../object/UIModel"
import {pageRemote, fileRemote, compose} from '@skedo/request'
import {
  JsonPage,
  Topic,
} from "@skedo/meta"
import {ComponentsLoader} from '@skedo/loader'

const json: JsonPage = {
  page: {
    type: "react",
    name: "page",
    group: "container",
    box: {
      left: (3200 - 414) / 2,
      top: 40,
      width: 414,
      height: 736,
    },
    children: [],
    style: {
      border: "1px solid #eee",
      backgroundColor: "white",
    },
  },
	links : {}
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
			const user = localStorage['x-user']
			const result = await svcCall(user, pageName)

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