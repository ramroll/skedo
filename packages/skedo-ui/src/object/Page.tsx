import ReactDOM from 'react-dom'
import {
  Emiter,
  Topic,
  Cord,
  Node,
  NodeType,
  boxDescriptor,
  NodeJsonStructure,
  BoxDescriptor,
  NodeData,
  BoxDescriptorInput,
  Logger,
  sizeUnitToNumber,
  ComponentMeta,
} from "@skedo/core"
import { EditorModel } from "./EditorModel";
import ComponentsLoader from "./ComponentsLoader";
import { History } from "./History";
import PageExporter from "./PageExporter";
import {fileRemote, pageRemote, compose} from "@skedo/request"
import {fromJS} from 'immutable'
import NodeStyleHelper from "../components/NodeStyleHelper";



export default class Page extends Emiter<Topic>{
  root : NodeType
  id_base : number 
  nodes : Array<Node>
  pageNode : NodeType
  history : History
  name : string
  logger : Logger = new Logger('page')
  editor : EditorModel
  styleHelper : NodeStyleHelper

  constructor(name : string, editor :EditorModel,  json : NodeJsonStructure){
    super()
    this.name = name
    this.editor = editor
    this.history = new History()
    this.id_base = 1
    this.nodes = []
    editor.page = this
    this.styleHelper = new NodeStyleHelper()

    const box = boxDescriptor({
      left : 0,
      top : 0,
      width : 3200,
      height : 3200,
      mode : 'normal'
    })
    const meta = ComponentsLoader.loadByName("basic", "root")
    this.root = new Node(meta, meta.createData(this.createId(), box))
    this.linkPage(this.root)
    const pageNode = this.fromJson(json)
    pageNode.setAllowDrag(false)
    this.root.add(pageNode)
    this.pageNode = pageNode
    
    // @ts-ignore
    // 调试用
    window["root"] = this.root

    // @ts-ignore
    window["page"] = this
    // @ts-ignore
    window["pageHistory"] = this.history

    this.history.clear()
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
    this.logger.log('save', json)

  }

  createFromJSON = (json: NodeJsonStructure) => {
    if(typeof json.box.width !== 'object') {
      json.box = boxDescriptor(json.box as BoxDescriptorInput)
    }
    return this.fromJson(json)
  }

  createFromMeta(
    meta :ComponentMeta 
  ) {
    const box = meta.box
    const pageNode = this.pageNode.getRect()
    const width = sizeUnitToNumber("width", box.width, pageNode.width, pageNode.height)
    const height = sizeUnitToNumber("height", box.height, pageNode.width, pageNode.height)
    const cord = this.editor.cord
    const ipt = boxDescriptor({ 
      left : cord.worldX() - width / 2,
      top : cord.worldY() - height / 2,
      width : box.width.isAuto ? '' : box.width.value + box.width.unit,
      height : box.height.isAuto ? '' : box.height.value + box.height.unit,
      mode : box.mode
    })

    const id = this.createId()
    const nodeData = meta.createData(id, ipt)
    const node = new Node(
      meta,
      nodeData
    )
    this.linkPage(node)
    return node
  }

  fromJson(
    json: NodeJsonStructure
  ): Node {
    if(typeof json.box.width !== 'object') {
      json.box = boxDescriptor(json.box as BoxDescriptorInput)
    }
    const meta = ComponentsLoader.loadByName(
      json.group,
      json.name
    )
    
    const id = json.id || this.createId() 
    const instanceData = json.id ? 
      fromJS(json) : meta.createData(id, json.box as BoxDescriptor) 
    const node = new Node(meta, instanceData as NodeData)
    this.linkPage(node)

    if(!json.id) {
      json.children &&
        json.children.forEach((child) => {
          node.add(this.fromJson(child))
        })
    } else {
      json.children &&
        node.setChildren(json.children.map(child => {
          const childNode = this.fromJson(child)
          childNode.setParent(node)
          return childNode
        }))
    }
    return node
  }

  copy(source : NodeType) {
    const rect = source.getRect()
    const id = this.id_base++

    const box = boxDescriptor({
      left : rect.left,
      top : rect.top,
      width : rect.width,
      height : rect.height,
      mode : source.getBox().mode
    })


    const data = source.meta.createData(id, box)
    const node = new Node(
      source.meta,
      data
    )
    source.getChildren().forEach((child) => {
      node.add(this.copy(child))
    })
    this.linkPage(node)
    return node
  }

  private createId(){
    return this.id_base++
  }

  private linkPage(node : Node) {
    this.nodes[node.getId()] = node
  }


  // renderExternal(node : NodeType, elem: HTMLElement) {
  //   const component = <InjectComponent node={node} editor={this.editor} />
  //   this.logger.log("render external", elem, component)
  //   ReactDOM.render(component, elem)
  // }
}