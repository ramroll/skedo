import { Topic } from './Topic'
import { Node } from './Node'
import { Emiter } from './Emiter'
import { NodeJsonStructure } from './NodeJsonStructure'

export class Bridge {
  node : Node 
  constructor(node : Node){
    this.node = node
  }

  editMode(){
    this.node.setEditMode(true)
    this.node.emit(Topic.Updated)
  }

  normalMode(){
    this.node.setEditMode(false)
    this.node.emit(Topic.ResizeModelUpdated)
  }

  setPropsValue(key : string, value : any)  {
    const passProps = this.node.getPassProps()
    this.node.setpassProps(passProps.set(key, value))
    this.node.emit(Topic.Updated)
  }

  triggerAutoResizing() {
    this.node.emit(Topic.ResizeModelUpdated)
  }

  createChildBridge(json : NodeJsonStructure) : Bridge {
    const node = this.node.addFromJSON(json)
    return new Bridge(node)
  }

  renderExternal(elem : HTMLElement) {
    this.node && this.node.renderExternal && this.node.renderExternal(elem)
  }

  static getMockBridge(){
    const node : unknown = new Emiter<Topic>()
    
    // @ts-ignore
    node.addFromJSON = () => {
    }
    // @ts-ignore
    node.renderExternal = () => {
    }
    const bridge = new Bridge(node as Node)

    return bridge

  }

}
