import {NodeType as Node, PropMeta, Topic} from '@skedo/meta'
import {Emiter} from '@skedo/utils'


export default class PropItem extends Emiter<Topic> {

  meta : PropMeta 
  nodes : Array<Node> 
  disabled : boolean 
  value : any
  constructor(meta : PropMeta, node : Node) {
    super()
    this.meta = meta 
    this.nodes = []
    this.nodes.push(node)
    this.disabled = meta.disabled || false
    this.value = PropMeta.getPropValue(meta.path, node.getData()) 
  }

  merge(prop : PropMeta, node : Node) {
    const value = PropMeta.getPropValue(prop.path, node.getData())
    if(value !== this.value) {
      this.disabled = true
    } 
    this.nodes.push(node)
  }

  update() {
    if(this.disabled) {
      return
    }
    if (this.nodes.length > 0) {
      this.value = PropMeta.getPropValue(
        this.meta.path,
        this.nodes[0].getData()
      )
      // If immutable object
      if(this.value && this.value.toJS) {
        this.value = this.value.toJS()
      }
      this.emit(Topic.PropertyChanged)
    }
  }

  set(value : any) {
    this.nodes.forEach(node => {
      node.updateInstanceByPath(this.meta.path, value)
    })
    this.emit(Topic.PropertyChanged)
  }


}