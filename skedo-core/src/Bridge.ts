import { Topic } from './Topic'
import { Node } from './instance/Node'
import { Emiter } from './Emiter'
import { NodeJsonStructure } from './NodeJsonStructure'
import { Page } from './Page'

export class Bridge {
  node : Node 
  page : Page 
  constructor(node : Node, page : Page){
    this.node = node
    this.page = page
  }

  public setEditMode(mode :boolean){
    this.node.setEditMode(mode)
    this.node.emit(Topic.Updated)
  }

  public setPropsValue(key : string, value : any)  {
    const passProps = this.node.getPassProps()
    this.node.setpassProps(passProps.set(key, value))
    this.node.emit(Topic.Updated)
  }

  public triggerAutoResizing() {
    this.node.emit(Topic.ResizeModelUpdated)
  }


  public addChild(child: Node) {
    this.node.add(child)
  }

  public createNode(json : NodeJsonStructure) : Node{
    return this.page.createFromJSON(json)
  }

  public renderExternal(node : Node, elem :Element) {
    this.page.renderExternal(node, elem)
  }

  static getMockBridge(){
    const node : unknown = new Emiter<Topic>()
    const page : unknown = new Emiter<Topic>()
    
    // @ts-ignore
    page.createFromJSON = () => {
    }
    // @ts-ignore
    page.renderExternal = () => {
    }

    const bridge = new Bridge(node as Node, page as Page)

    return bridge

  }


  static of(node : Node, page : Page) {
    let bridge = node.bridgeCache
    if(!bridge) {
      bridge = new Bridge(node, page)
      node.bridgeCache = bridge
    }
    return bridge

  }

}
