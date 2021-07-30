import { Topic } from './Topic'
import { Node } from './instance/Node'
import { Emiter } from './Emiter'

export class Bridge {
  node : Node 
  renderForReact ? : (node : Node, key ? : any, childrenProps? : any) => JSX.Element
  constructor(node : Node){
    this.node = node
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


  static getMockBridge(){
    const node : unknown = new Emiter<Topic>()
    
    const bridge = new Bridge(node as Node)

    return bridge

  }


  static of(node : Node) {
    let bridge = node.bridgeCache
    if(!bridge) {
      bridge = new Bridge(node)
      node.bridgeCache = bridge
    }
    return bridge

  }

  renderAsReact(node : Node, key? : any, childrenProps? : any) : JSX.Element {
    return this.renderForReact!(node, key, childrenProps)
  }

  renderAsVue(){
    
  }

}
