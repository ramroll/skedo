import { Topic } from "../Topic"
import { Node } from "./Node"
import { NodeType, JsonNode,  NodeData, BoxDescriptorInput, JsonPage} from "../standard.types"
import { BoxDescriptor } from "../BoxDescriptor"
import { Logger, Emiter } from "@skedo/utils"
import {ComponentMeta} from '../meta/ComponentMeta'
import {fromJS} from 'immutable'
import { LinkedNode } from "./LinkedNode"



type ComponentsLoader = {
  loadByName : (group : string, name : string) => ComponentMeta
}

export class Page extends Emiter<Topic>{
  root : NodeType
  id_base : number 
  nodes : Array<Node>
  pageNode : NodeType
  name : string
  logger : Logger = new Logger('page')
  loader : ComponentsLoader
  links : Record<number, Node>

  constructor(name : string, json : JsonPage, loader : ComponentsLoader ){
    super()
    this.name = name
    this.id_base = 1
    this.nodes = []
    this.loader = loader

    const meta = this.loader.loadByName("container", "root")
    const box = new BoxDescriptor({
      left : 0,
      top : 0,
      width : 3200,
      height : 3200
    }, meta)
    this.root = new Node(meta, meta.createData(this.createId(), box))
    this.linkPage(this.root)

    this.links = {}
    Object.keys(json.links).forEach( (id : any) => {
      this.links[id] = this.fromJson(json.links[id])
    })

    const pageNode = this.fromJson(json.page)
    pageNode.setAllowDrag(false)
    this.root.addToAbsolute(pageNode)
    this.pageNode = pageNode
    
    // @ts-ignore
    // 调试用
    window["root"] = this.root

    // @ts-ignore
    window['page'] = this
  }

  public getNodeById(id : number){
    return this.nodes[id]
  }


  public createFromJSON = (json: JsonNode) => {
    return this.fromJson(json)
  }

  public createFromMetaNew(
    meta : ComponentMeta,
    position : [number, number]
  ) {
    const box = meta.box.clone()
    const id = this.createId()
    const nodeData = meta.createData(id, box)
    const node = new Node(
      meta,
      nodeData
    )
    this.linkPage(node)
    return node 
  }

  public fromJson(
    json: JsonNode
  ): Node {
    const meta = this.loader.loadByName(
      json.group,
      json.name
    )
    const box = new BoxDescriptor(json.box, meta)

    
    if(json.id) {
      this.id_base = Math.max(this.id_base, json.id + 1)
    }
    const id = json.id || this.createId() 
    
    let node : Node
    if(json.id) {
      const instanceData = meta.createDataFromJson(json) 
      node = json.linkedId ? 
        new LinkedNode(json.id, this.links[json.linkedId], instanceData.get('box'))
        :new Node(meta, instanceData as NodeData)

    } else {
      const instanceData = meta.createData(id, box) 
      node = new Node(meta, instanceData as NodeData)
    }
    
    this.linkPage(node)

    if(!json.id) {
      json.children &&
        json.children.forEach((child) => {
          node.addToRelative(this.fromJson(child))
        })
    } else {
      json.children && !json.linkedId &&
        node.setChildren(json.children.map(child => {
          const childNode = this.fromJson(child)
          childNode.setParent(node)
          return childNode
        }))
    }
    return node
  }

  public createLinkNode(node : Node) {
    const id = this.id_base++
    const linked = new LinkedNode(id, node)
    this.linkPage(linked)
    return linked
  }

  public copy(source : NodeType) {
    const rect = source.getRect()
    const id = this.id_base++

    const box = new BoxDescriptor({
      left : rect.left,
      top : rect.top,
      width : rect.width,
      height : rect.height
    }, source.meta)


    const data = source.meta.createData(id, box)
    const node = new Node(
      source.meta,
      data
    )
    source.getChildren().forEach((child) => {
      node.addToRelative(this.copy(child))
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

  public getRoot(){
    return this.root
  }

  public cloneNode(node : Node, parent? : Node) {
    const meta = node.meta
    const data = node.getData()
      .set('id', this.createId())

    const newNode = new Node(meta, data)
    if(parent) {
      newNode.setParent(parent)
    }
    this.linkPage(newNode)

    const children = newNode.getChildren() 
      .map(child => this.cloneNode(child, newNode))
    newNode.setChildren(children)
    return newNode

  }

  // renderExternal(node : NodeType, elem: HTMLElement) {
  //   const component = <InjectComponent node={node} editor={this.editor} />
  //   this.logger.log("render external", elem, component)
  //   ReactDOM.render(component, elem)
  // }
}