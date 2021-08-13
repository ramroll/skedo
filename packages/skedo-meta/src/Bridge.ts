import { Node } from './instance/Node'
import { NodeJsonStructure, RenderFor, RenderOptions } from './standard.types'
import { Page } from './instance/Page'
import invariant  from 'invariant'
import { Topic } from './Topic'



export class Bridge {
  private node?: Node
  private page?: Page

  
  renderForReact?: (
    node: Node,
    options: RenderOptions
  ) => any
  constructor(node?: Node, page ? : Page) {
    this.node = node
    this.page = page
  }


  public getNode(){
    invariant(this.node, "member node not exists on bridge, maybe this is a mocked bridge.")
    return this.node!
  }

  private getPage(){
    invariant(this.page, "member page not exists on bridge, maybe this is a mocked bridge.")
    return this.page!
  }

  public passProps(): any {
    return this.getNode().getPassProps().toJS()
  }

  public setPropValue(path: Array<string>, value : any) {
    return this.getNode().setPassPropValue(path, value)
  }

  public on(topic : Topic | Topic[]) {
    return this.getNode().on(topic)
  }

  public render(
    type: RenderFor,
    node: Node,
    options: RenderOptions
  ) {
    switch (type) {
      case "react": {
        return this.renderForReact!(node, options)
      }
      case "dom" : 
        return this.renderForReact!(node, options)
    }
  }

  public createExternalNode(json:NodeJsonStructure){
    const node = this.getPage().createFromJSON(json)
    this.getNode().addToRelative(node)
    return node
  }
}
