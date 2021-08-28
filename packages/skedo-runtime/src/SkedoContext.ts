import {Page} from '@skedo/meta'
import { SkedoNodeProxy } from './SkedoNodeProxy'
export class SkedoContext {
  private page : Page

  constructor(page : Page) {
    this.page = page
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
}