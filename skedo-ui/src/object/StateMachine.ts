import {Emiter, Topic} from "@skedo/core"

export default class StateMachine<T, U> extends Emiter<Topic> {

  map : Map<T, Map<U, () => T>>
  state : T

  constructor(initialState : T){
    super()
    this.state = initialState
    this.map = new Map()
  }

  addRule(from : T, trigger : U, fn : () => T) {
    if(!this.map.has(from)) {
      this.map.set(from , new Map())
    }
    const m = this.map.get(from)
    if(!m?.has(trigger)) {
      m?.set(trigger, fn) 
    }
  }


  next(trigger : U) {
    const m = this.map.get(this.state)
    if(m?.has(trigger)) {
      const handler = m.get(trigger)
      if(handler) {
        this.state = handler()
      }
    }
  }
}
