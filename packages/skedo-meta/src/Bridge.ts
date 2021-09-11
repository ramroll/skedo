import { Node } from './instance/Node'
import { JsonNode, RenderFor, RenderOptions, SkedoEventName } from './standard.types'
import { Page } from './instance/Page'
import invariant  from 'invariant'
import { Topic } from './Topic'
import { LinkedNode } from './instance/LinkedNode'



type BridgeMode = "editor" | "render"

export class Bridge {
  private node?: Node
  private page?: Page
  private mode : BridgeMode
  private dataChangeHandlers : Function[] = [] 

  
  renderForReact?: (
    node: Node,
    options: RenderOptions
  ) => any

  constructor(node?: Node, page ? : Page, mode : BridgeMode = "editor") {
    this.node = node
    this.page = page
    this.mode = mode
    node?.on(Topic.MemorizedDataChanged).subscribe(() => {
      this.dataChangeHandlers.forEach((h) => h())
    })
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
    this.getNode().setPassPropValue(path, value)
    this.getNode().emit(Topic.NodePropUpdated)
  }

  public getMode(){
    return this.mode
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


  public createLinkNode(node : Node) {
    const linked = this.getPage()!.createLinkNode(node) 
    return linked
  }

  public createExternalNode(json:JsonNode){
    const node = this.getPage().createFromJSON(json)
    return node
  }

  public addChild(node : Node) {
    this.getNode().addToRelative(node)
    return node
  }

  public notify(eventType : SkedoEventName) {
    this.node?.emit(Topic.ExternalEventNotify, {
      type : eventType,
      node : this.node 
    })
  }

  public getMemorizedData() {
    return this.node?.getMemorizedData()
  }

  public getNodeData(){
    const data = this.getMemorizedData()
    const path = this.node?.getPassProps().get('dataPath')
    if(!path) {
      return data
    }
    return data? data[path] : null
  }

  public cloneNode(node : Node) : Node {
    return this.page!.cloneNode(node)
  }

  public sendToCodeless(msg : any) {
    this.page?.emit(Topic.ContextMessage, msg)
  }

  public onDataChanged(handler : Function){
    this.dataChangeHandlers.push(handler)
  }
}
