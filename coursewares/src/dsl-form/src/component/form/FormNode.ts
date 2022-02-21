import { Form } from "./Form";
import { FormDSL } from "./form.types";
import {Collection} from "immutable"
import { Emiter } from "./Emiter";

export class FormNode extends Emiter {

  private children : FormNode[]
  private form : Form
  private props : any 
  constructor(private dsl : FormDSL, form : Form) {
    super()
    this.children = []
    if(dsl.children) {
      this.children = dsl.children.map(d => new FormNode(d, form))
    }
    this.form = form
    this.props = {...dsl.props}

    if( this.dsl.hooks?.onDataChange  ) {
      this.form.on("data-changed", ({path, value}) => {
        this.dsl.hooks?.onDataChange!(path, value, form)
      })
    }
  }

  getType(){
    return this.dsl.type
  }

  getChildren(){
    return this.children
  }

  getProp(key : string){
    return this.dsl.props?.[key]
  }

  update(data : Collection<string ,any>) {
    if (this.dsl.path) {
      const oldVal = this.form.getDataByPath(this.dsl.path);
      const newVal = data.getIn(this.dsl.path);
      if(oldVal !== newVal) {

        this.form.setDataByPath(this.dsl.path, newVal)
        console.log('node-value-changed', this.dsl.path.join('.'))
        this.emit("node-value-changed")
      }
    }

    this.children.forEach(child => child.update(data))

  }

  isInputNode(){
    return !!this.dsl.path
  }

  setProps(setter : (props : any) => any){
    this.props = setter(this.props)
    this.emit("node-props-changed")
  }

  getProps(){
    return this.props
  }

  onDataChange(value : any) {
    if(!this.dsl.path) {
      return
    }
    const oldValue = this.form.getDataByPath(this.dsl.path)
    if(oldValue !== value)
      this.form.onDataChange(this.dsl.path!, value)
  }

  findByName(name : string) : FormNode | null {
    if(this.dsl.name === name) {
      return this
    }
    for(let child of this.children) {
      let item = child.findByName(name)
      if(item) {
        return item
      }
    }
    return null
  }

  getValue() {
    if(this.dsl.path) {
      return this.form.getDataByPath(this.dsl.path) || this.dsl.defaultValue
    }
  }

  static fromDSL(dsl : FormDSL, form : Form) {
    return new FormNode(dsl, form)
  }
}