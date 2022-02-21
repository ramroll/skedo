export class TreeNode<T> {
	left : TreeNode<T>
	right : TreeNode<T>
	data : T

	constructor(data : T) {
		this.data = data 
	}
}


function log(x){
	console.log(x)
}

const node = new TreeNode<number>(100)
log( node.data )
