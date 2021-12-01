import { useEffect, useRef, useState } from "react"
import {pageRemote, fileRemote, compose,} from '@skedo/request'
import { JsonPage, Page, Topic } from "@skedo/meta"
import { ComponentsLoader } from "@skedo/loader"
import { CodeProjectRepo } from "@skedo/code"
import * as runtime from "@skedo/runtime"
import { SkedoContext } from "@skedo/runtime"

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


class Modules {

  static inst = new Modules()

  public static get() {
    return Modules.inst
  }

  resolve(name : string){
    switch(name) {
      case '@skedo/runtime':
        return runtime 
      default:

				throw new Error(`unable to resolve ${name}.`)

    }

  }
}

function runScript(text : string, ctx : any){
  function define(deps : Array<string>, callback : (...deps : Array<any>) => void){
    if(!callback) {
      // @ts-ignore
      callback = deps  
      deps = []
    }
    console.log('deps', deps)
    const depTypes = deps.map(stringName => {
      const modules = Modules.get()
      return modules.resolve(stringName)
    })
    const r = callback(...depTypes)
    // @ts-ignore
    r(ctx)
  }
  return eval(text)
}


export const usePage = (pageName : string) : (Page | null) => {
	
	const [page, setPage] = useState<Page | null>(null)

	const ctx = useRef<SkedoContext | null>(null)

	async function run(page : Page){

		try{
			const project = await CodeProjectRepo.load('codeless-' + pageName)
      console.log(project)
			const url = project.getScriptURL()
			const result = await fileRemote.get(url)
			const content = result.data
			ctx.current = new SkedoContext(page!)
			runScript(content, ctx.current)
		}catch(ex) {
			console.error(ex)
		}
	}
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

			await run(page)
			page.emit(Topic.Initialize)
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
