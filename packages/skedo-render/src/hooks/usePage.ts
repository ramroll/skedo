import { useEffect, useState } from "react"
import {pageRemote, fileRemote, compose,} from '@skedo/request'
import { boxDescriptor, JsonNode } from "@skedo/meta"


const json : JsonNode = {
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

const usePage = (pageName : string) : (JsonNode | null) => {
	
	const [page, setPage] = useState<JsonNode | null>(null)

	useEffect(() => {

		async function loadPage(){
			const svcCall = compose(pageRemote.get, fileRemote.get, data => {
				if(!data) {
					return false
				}
				return [data.url]
			})
			const result = await svcCall(pageName)

			if(result.success){
				const page = JSON.parse(result.data)
				setPage(page)
			} else {
				setPage(json)
			}
		}

		loadPage()

	}, [])

	return page


}

export default usePage