import { NodeType as Node, GroupMeta, Topic } from "@skedo/meta"
import {Emiter} from '@skedo/utils'
import SelectionNew from './Selection.new'
import { UIModel } from "./UIModel"
import PropItem from './PropItem'


export default class PropertyEditor extends Emiter<Topic>{

  groups : Array<GroupMeta> 
  props : {[name : string] : PropItem}
  selection : SelectionNew
  constructor(editor : UIModel){
    super()
    this.groups = [] 
    this.props = {}
    this.selection = editor.selection
    editor.on(Topic.SelectionChanged)
      .subscribe(() => {
        this.handleSelectionChange(this.selection)
        this.emit(Topic.PropertyModelUpdated)
        this.getProps().forEach(prop => {
          prop.update()
        })
      })

    editor.on([Topic.Resized, Topic.NodeMoved]).subscribe(() => {
      this.getProps().forEach((prop) => {
        prop.update()
      })
    })
    
  }

  getProps(){
    return Object.values(this.props)
  }

  addNode(node : Node) {
    const meta = node.meta
    
    // 合并分组
    for(let group of meta.groups) {
      const sameGroup = this.groups.find(x => x.name === group.name)
      if(sameGroup) {
        sameGroup.mergeGroup(group)
      } else {
        this.groups.push(group.clone())
      }
    }

    // 合并属性清单
    for(let key in meta.props) {
      const prop = meta.props[key]
      if(this.props[key]) {
        this.props[key].merge(prop, node)
      } else {
        this.props[key] = new PropItem(prop, node)        
      }

    }
  }

  handleSelectionChange = (selection : SelectionNew) => {
    this.groups = []
    this.props = {}
    selection.forEach(node => {
      this.addNode(node)
    })
  }

}

