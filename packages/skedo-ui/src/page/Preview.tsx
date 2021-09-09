import { useParams } from "react-router"
import TitleBar from "../components/frame/TitleBar"
import style from  "./ui.module.scss"
import { NodeRender } from '@skedo/render'
import { usePage } from "@skedo/render"
import {CordNew, Page} from "@skedo/meta"
import { ComponentsLoader } from "@skedo/loader"
import { useEffect } from "react"
import { CodeProjectRepo } from "@skedo/code"
import { fileRemote } from "@skedo/request"
import * as runtime from "@skedo/runtime"
import { SkedoContext } from "@skedo/runtime"
import { RenderContext } from "@skedo/render"
import { Rect } from "@skedo/utils"

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


const Preview = () => {

	const {page : pageName} = useParams<{[key : string] : string}>()
  const page = usePage(pageName) 

  useEffect(() => {

    if(!page) {
      return
    }

    async function run(){

      try{
        const project = await CodeProjectRepo.load(pageName)
        const url = project.getScriptURL()
        const result = await fileRemote.get(url)
        console.log('script loaded.', project.getScriptURL(), result)
        const content = result.data
        runScript(content, new SkedoContext(page!))
      }catch(ex) {
        console.error(ex)
      }
    }
    run()
  }, [page])

  if(page === null) {
    return null
  }

  return (
    <div>
      <TitleBar pageName={pageName} name={"preview"} />
      <div className={style['preview-container']}>
        <RenderContext.Provider value={{
          cord : new CordNew(Rect.ZERO),
          page : page 
        }}>
          <NodeRender node={page.getRoot()} />
        </RenderContext.Provider>
      </div>
    </div>
  )
}

export default Preview