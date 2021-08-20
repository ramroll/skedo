import {PropConfig} from './ComponentMeta'
import {Map as ImmutableMap} from 'immutable'

export class PropMeta {
  disabled? : boolean
  path : Array<string>
  config : PropConfig

  constructor(config : PropConfig) {
    this.config = config
    this.path = config.path.split('.')
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
