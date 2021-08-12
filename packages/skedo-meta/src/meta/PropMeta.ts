import {PropConfig} from './ComponentMeta'
import {Map as ImmutableMap} from 'immutable'
import { SizeUnit } from '../BoxDescriptor'

export class PropMeta {
  name : string
  props? : any
  type : string
  disabled? : boolean
  default : any
  label : string
  selections ? : any
  path : Array<string>
  row ? : number
  rowLabel : string

  constructor(config : PropConfig) {
    this.name = config.name
    this.props = config.props
    this.type = config.type
    this.disabled = config.disabled
    this.default = config.default
    this.label = config.label
    this.path = config.path.split('.')
    this.row = config.row
    this.rowLabel = config.rowLabel
    this.selections = config.selections
  }

  static setPropValue(path : Array<string>, data : ImmutableMap<string, any>, value : any) {
    if(path[0] === 'rect') {
      const rect = data.get('rect').clone()
      rect[path[1]] = value
      return data.set('rect', rect)
    }
    if(path[0] === 'box') {
      const box = data.get('box')
      box[path[1]] = value.clone()
      console.log(value)
      return data
    }
    return data.setIn(path, value)
  }

  static getPropValue(path : Array<string>, data : ImmutableMap<string, any>) {
    if(path[0] === 'rect') {
      return data.get('rect')[path[1]]
    }
    if(path[0] === 'box') {
      return data.get('box')[path[1]]
    }
    return data.getIn(path)
  }
}
