import {Action, createStore} from 'redux'
import { shallow } from './shallow'

type ReducerType<T, A extends Action> = (state : Instance<T>, action : A & {args: Array<any>}) => Instance<T> 


interface Constructor{
  new(...args : Array<any>) : any 
}

interface Ctor<T> {
  new(...args : Array<any>)  : T
}

type Instance<T> = T extends Ctor<infer R> ? R : T

const ActionSymbol = Symbol('action')
export function action(target : any, name : string, descriptor : PropertyDescriptor) {
  descriptor.value[ActionSymbol] = true
  return descriptor
}

export function asReducer<
  T extends Constructor,
  A extends Action
>(Target: T): ReducerType<T, A> {
  const ShallowClass = shallow(Target, [ActionSymbol])
  return (state = new ShallowClass(), action: A & {args : Array<any>}) => {
    const { type, args } = action
    
    if (typeof state[type] === "function") {
      if(state[type][ActionSymbol]) {
        (state as any)[type](...args)
      }
    }
    return state
  }
}

