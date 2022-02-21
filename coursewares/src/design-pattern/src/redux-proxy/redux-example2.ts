import { createStore } from "redux"
import { asReducer, action } from "./asReducer"

// list : 100W  [...list]
// immutable 100W hashTable[i..] C
class ToDoList {
	private list : string[] = [] 
	
  @action
	public append(todo : string){
		this.list.push(todo)
	}

  @action
  public insert(todo : string) {
    this.list.unshift(todo)
  }

	public getList(){
		return this.list
	}
}

const reducer = asReducer(ToDoList)
const store = createStore(reducer)

let list = store.getState().getList()
store.subscribe(() => {
	const state = store.getState()
	if(state.getList() !== list) {
		list = state.getList()
		console.log('list changed:', list)
	}
})

store.dispatch({
	type : 'append',
	args : ["TODO-A"]
})

store.dispatch({
	type : 'insert',
	args : ["TODO-B"]
})





