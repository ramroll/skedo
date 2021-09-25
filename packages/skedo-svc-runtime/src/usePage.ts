import { useEffect, useState } from "react"
import {pageRemote, fileRemote, compose,} from '@skedo/request'
import { JsonPage, Page, Topic } from "@skedo/meta"
import { ComponentsLoader } from "@skedo/loader"


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

export const usePage = (pageName : string) : (Page | null) => {
	
	const [page, setPage] = useState<Page | null>(null)

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

			let data : JsonPage
			if(result.success){
				data = JSON.parse(result.data)
			} else {
				data = json
			}

			const page = new Page(
        pageName,
        data,
        ComponentsLoader.get()
      )

			setPage(page)
		}
		ComponentsLoader.get().on(Topic.RemoteComponentsLoaded)
			.subscribe(() => {
				loadPage()
			})


		ComponentsLoader.get().load()


	}, [])

	return page


}
