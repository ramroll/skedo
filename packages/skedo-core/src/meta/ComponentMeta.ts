
import {GroupMeta} from './GroupMeta'
import {PropMeta} from './PropMeta'
import {Map as ImmutableMap, fromJS} from 'immutable'
import { boxDescriptor } from '../BoxDescriptor'
import { BoxDescriptor, BoxDescriptorInput } from '../standard.types'

export interface PropConfig {
  name : string,
  props? : any
  type : string,
  disabled? : boolean
  default : any
  label : string
  selections ? : any
  path : string,
  row ? : number
  rowLabel : string
}

export interface GroupConfig {
  name : string,
  title : string,
  disabled : boolean,
  style : any,
  props : Array<PropConfig>
}

export interface PropsEditorConfigure {
  groups? : Array<GroupConfig>
}

export interface ComponentMetaConfig {
  type : string,
  name : string,
  image : string,
  title : string,
  isContainer : boolean,
  box : BoxDescriptorInput,
  editor : PropsEditorConfigure,
  description : string,
  intrinsic? :  boolean,
  style? : any,
  author : string,
  defaultProps : any,
  group : string,

  /* External components' */
  componentType? : 'react' | 'vue', 
  src : string, // source file location
  file : string, // js file location
  url? : string,
  yml : string, 
  imageUrl : string,
  version : string
}


export class ComponentMeta {
  type : string  
  name : string  
  group : string
  image : string
  title : string
  isContainer : boolean
  box : BoxDescriptor
  editor : PropsEditorConfigure
  intrinsic? :  boolean
  url? : string
  style? : any
  defaultProps : any
  imageUrl : string
  componentType : 'react' | "vue"
  props : {[name : string] : PropMeta}
  groups : Array<GroupMeta>

  

  constructor(config : ComponentMetaConfig) {
    
    this.type = config.type
    this.name = config.name
    this.group = config.group
    this.image = config.image
    this.title = config.title
    this.isContainer = config.isContainer
    this.box = boxDescriptor(config.box)
    this.intrinsic = config.intrinsic
    this.url = config.url
    this.style = config.style
    this.defaultProps = config.defaultProps
    this.imageUrl = config.imageUrl
    this.componentType = config.componentType || 'react'
    this.editor = config.editor
    this.props = {}
    this.groups = []

    if (config.editor && config.editor.groups) {
      for (let group of config.editor.groups) {
        this.groups.push(GroupMeta.of(group))
        for (let prop of group.props || []) {
          this.props[prop.name] = new PropMeta(prop)
        }
      }
    }
  }


  /**
   * 创建实例数据
   * @param id 
   * @param box 
   * @returns 
   */
  createData(id : number, box : BoxDescriptor | null) {

    const isBoxDescritor = typeof box?.width === 'object'

    let data = ImmutableMap({
      id,
      parent: null,
      type: this.type,
      name : this.name,
      group: this.group,
      style: ImmutableMap<string, any>(),
      children: [],
      allowDrag: true,
      isMoving: false,
      editMode: false,
      passProps: fromJS(this.defaultProps || {}),
      isContainer: this.isContainer,
      box : fromJS(box)
    })


    for(let key in this.props) {
      const prop = this.props[key]
      if (prop.default !== undefined) {
        data = PropMeta.setPropValue(
          prop.path,
          data,
          prop.default
        )
      }
    }
    
    data = data.update(
      "style",
      (style: any) => {
        const metaStyle = fromJS(this.style) as ImmutableMap<string,any>
        return style.merge(metaStyle)
      }
    ) 


    return data
  }

}
