import Node from "./Node";
import { Emiter, Topic, boxDescriptor, JsonWidgetTree, NodeJsonStructure, CustomResponse, Logger} from '@skedo/core'
import { EditorModel } from "./EditorModel";
import ComponentsLoader from "./ComponentsLoader";
import { History } from "./History";
import Cord from "./Cord";
import PageExporter from "./PageExporter";
import {fileRemote, pageRemote, compose} from "@skedo/request"




export default class Page extends Emiter<Topic>{
  root : Node
  id_base : number 
  nodes : Array<Node>
  pageNode : Node
  history : History
  name : string
  logger : Logger = new Logger('page')

  constructor(name : string, editor :EditorModel,  json : NodeJsonStructure){
    super()
    this.name = name
    this.history = new History()
    this.id_base = 1
    this.nodes = []
    editor.page = this
    this.root = new Node(editor, boxDescriptor({
      left : 0,
      top : 0,
      width : 3200,
      height : 3200,
      mode : 'normal'
    }), ComponentsLoader.loadByName("basic", "root"))
    const pageNode = Node.fromJson(json, editor)
    pageNode.setAllowDrag(false)
    this.root.add(pageNode)
    this.pageNode = pageNode
    
    // @ts-ignore
    // 调试用
    window["root"] = this.root
    // @ts-ignore
    window["pageHistory"] = this.history

    this.history.clear()
  }

  addNode(node : Node) {
    this.nodes[this.id_base++] = node
    return this.id_base - 1
  }


  nodeByCord(cord : Cord) {
    let p = document.elementFromPoint(cord.clientX, cord.clientY)

    const regex = /^c-\d+$/
    while(p) {
      let id = p.getAttribute('id') || ''
      if( regex.test(id) ){
        const idString = id.split('-').pop()
        if(idString) {
          const idNumber = Number.parseInt(idString)
          return this.nodes[idNumber]
        }
      }
      p = p.parentElement
    }
    return null
  }

  public async save() {
    const exporter = new PageExporter()
    const json = exporter.exportToJSON(this.pageNode)
    const text = JSON.stringify(json)
    
    const composedRemoteCall  = compose(fileRemote.post1, pageRemote.put, (data) => {
      return [this.name, data]
    })

    const result = await composedRemoteCall("/page", "test.json", "1.0.0", text)
    console.log(result)
    this.logger.log('save', json)

  }

}