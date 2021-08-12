import { useEffect, useState } from "react"
import {pageRemote, fileRemote, compose,} from '@skedo/request'
import { NodeJsonStructure } from "@skedo/meta"


const json : NodeJsonStructure = {
  type : "react",
	name : "page",
  group : "basic",
	box : {
		left : (3200-414)/2,	
		top : 40,
		width :414,
		height : 736
	},
  children : [
  ],
  style : {
    border : "1px solid #eee",
    backgroundColor : 'white'
  },
}

const usePage = (pageName : string) : (NodeJsonStructure | null) => {
	
	const [page, setPage] = useState<NodeJsonStructure | null>(null)

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