import {Page, Topic} from '@skedo/meta'
import { SkedoNodeProxy } from './SkedoNodeProxy'
export class SkedoContext {
  private page : Page

  private handlers : Function[] = []
  private prepareHandler? : Function
  private loadHandler ? : Function

  constructor(page : Page) {
    this.page = page

    this.page.on(Topic.Initialize)
      .subscribe(() => {
        this.prepareHandler && this.prepareHandler()
      })
    this.page.on(Topic.Loaded)
      .subscribe(() => {
        this.loadHandler && this.loadHandler()
      })
    this.page.on(Topic.ContextMessage) 
      .subscribe((msg) => {
        this.handlers.forEach(h => h(msg))
      })
  }

  public select(name : string) {
    if(!name) {
      return null
    }

    for(let p of this.page.getRoot().bfs()) {
      if(p.getPassProps().get('name') === name) {
        return new SkedoNodeProxy(p)
      }
    }
    return null 
  }

  prepare(handler : Function){
    this.prepareHandler = handler
  }

  loaded(handler : Function){
    this.loadHandler = handler
  }

  onMessage(handler : Function) {
    this.handlers.push(handler)
  }
  
}