import { NodeType as Node, Emiter, GroupMeta, Topic } from "@skedo/core"
import SelectionNew from './Selection.new'
import {throttle, mergeWith } from 'rxjs/operators'
import {interval} from 'rxjs'
import { EditorModel } from "./EditorModel"
import PropItem from './PropItem'


export default class PropertyEditor extends Emiter<Topic>{

  groups : Array<GroupMeta> 
  props : {[name : string] : PropItem}
  selection : SelectionNew
  constructor(editor : EditorModel){
    super()
    this.groups = [] 
    this.props = {}
    this.selection = editor.selection
    // this.selection.on(Topic.SelectionChanged)
    //   .subscribe(() => {
    //     this.handleSelectionChange(this.selection)
    //     this.emit(Topic.PropertyEditorUpdated)
    //     this.getProps().forEach(prop => {
    //       prop.update()
    //     })
    //   })

    // const a1 = this.selection.on(Topic.SelectionMoving) 
    // const a2 = this.selection.on(Topic.SelectionMoved) 
    const a3 = editor.resizer.on(Topic.Resizing)
      .pipe(throttle(() => interval(200)))

    // a1.pipe(mergeWith(a2, a3))
    //   .pipe(throttle(() => interval(200)))
    //   .subscribe(() => {
    //     this.getProps().forEach(prop => {
    //       prop.update()
    //     })
    //   })
    
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

  handleSelectionChange = (selection : Selection) => {
    this.groups = []
    this.props = {}
    // for(let node of selection.nodes()) {
    //   this.addNode(node)
    // }
  }

}

