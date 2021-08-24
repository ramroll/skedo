import { Emiter } from '@skedo/utils'

type StateTransferFunction = (...args : Array<any>) => void 
type RegFuncType<S, A> = (
	from: S | S[],
	to: S,
	action: A,
	fn: StateTransferFunction
) => void
/**
 * S : 状态 
 * A : Action
 */
export default class StateMachine<
  S extends number,
  A extends number,
  Topic extends number
> extends Emiter<Topic> {
  s: S
  table: Map<S, Map<A, [StateTransferFunction, S]>>
  constructor(initialState: S) {
    super()
    this.s = initialState
    this.table = new Map()
  }

  private hash(s: S, a: A) {
    return s + 10000 * a
  }

  public register = (
    from: S | S[],
    to: S,
    action: A,
    fn: StateTransferFunction
  ) => {
    if (Array.isArray(from)) {
      from.forEach((f) => {
        this.register(f, to, action, fn)
      })
      return
    }
    if (!this.table.has(from)) {
      this.table.set(from, new Map())
    }
    const adjTable = this.table.get(from)!
    adjTable.set(action, [fn, to])
  }

  public describe = (desc: string, callback: ((f : RegFuncType<S,A>) => void)) => {
		callback(this.register)
	}

  public dispatch(action: A, ...data: Array<any>) {
    const adjTable = this.table.get(this.s)
    if (!adjTable) {
      return false
    }

    if (!adjTable.has(action)) {
      return false
    }

    const [fn, nextS] = adjTable.get(action)!
    fn(...data)
    this.s = nextS

    // Try all auto actions
    while (this.dispatch(0 as A, ...data));

    return true
  }

  public underState(s : S) {
    return this.s === s
  }
}