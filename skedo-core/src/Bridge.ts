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
    const child = this.page.createFromJSON(json)
    this.node.add(child)
    return new Bridge(child, this.page)
  }

  createNode(json : NodeJsonStructure) : Node{
    return this.page.createFromJSON(json)
  }

  static getMockBridge(){
    const node : unknown = new Emiter<Topic>()
    const page : unknown = new Emiter<Topic>()
    
    // @ts-ignore
    page.createFromJSON = () => {
    }
    // @ts-ignore
    node.renderExternal = () => {
    }

    const bridge = new Bridge(node as Node, page as Page)

    return bridge

  }


}
