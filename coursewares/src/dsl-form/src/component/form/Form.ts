import {Map, fromJS} from 'immutable'
import { Emiter } from './Emiter'
import { FormDSL } from './form.types'
import { FormNode } from './FormNode'
export class Form extends Emiter {
  private data : Map<string, any>

  private root : FormNode

  constructor(dsl : FormDSL, initialValues ?:any) {
    super()
    this.root = FormNode.fromDSL(dsl, this)
    this.data = fromJS(initialValues || {}) as Map<string, any>
  }

  onDataChange(path : (string | number)[], value : any) {
    this.data = this.data.setIn(path, value)
    this.emit("data-changed", {
      path : path.join("."), 
      value
    })
  }

  findByName(name : string){
    return this.root.findByName(name)
  }

  getValues(){
    return this.data.toJS()
  }

  setValues(values : Record<string, any>){
    const newData = fromJS(values) as Map<string, any>
    this.root.update(newData)
  }

  getRoot(){
    return this.root
  }

  getDataByPath(path : (string|number)[]){
    return this.data.getIn(path)
  }

  setDataByPath(path : (string|number)[], value : any){
    this.data = this.data.setIn(path, value)

  }

}