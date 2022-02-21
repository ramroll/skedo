
class TreeNode<T> {
  value : T
  id : number
  children : number[] 
  private tree : _Tree<T> 

  constructor(value : T, tree : _Tree<T>, id : number) {
    this.value = value
    this.tree = tree
    this.id = id
  }

  

  add(value : T) : TreeNode<T>{
    const node = this.tree.createNode(this.value)
    node.children = this.children.slice().concat(this.tree.createNode(value).id)
    this.tree.htable[this.tree._idCounter++] = node
    return node
  }

  getChildren(){
    return this.children.map(x => this.tree.htable[x])
  }
}


// class Tree<T> {
//   inst : _Tree<T>

//   add(path : number[], value : T) {
//   }
// }

// function createTree(){
//   const tree = new _Tree()
//   return new Proxy(tree, {
//     get(){},
//     set(){
//     }
//   })
// }

class _Tree<T> {
  private root : number 
  public htable : Map<number, TreeNode<T>> = new Map()
  _idCounter = 0

  getRoot(){
    return this.htable.get(this.root)
  }

  createNode(value : T) {
    const node = new TreeNode<T>(value, this, this._idCounter++) 
    this.htable.set(node.id, node)
    return node
  }
}



export {}