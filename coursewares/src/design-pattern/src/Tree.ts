class TreeNode<T> {

  val : T 
  children : TreeNode<T>[]
}


function *traverseLeafs<T>(node : TreeNode<T>){

  if(node.children.length === 0) {
    yield node
  }

  for(let child of node.children) {
    yield * traverseLeafs(child)
  }

}

const node = new TreeNode<number>()
const it = traverseLeafs(node)