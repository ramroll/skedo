export class LinkedList<T> {
  
	head : ListNode<T>
	tail : ListNode<T> 
	size : number = 0

	constructor(){
		this.head = new ListNode<T>(null)
		this.tail = this.head
	}

	push(data : T) {
		const node = new ListNode<T>(data)
		node.next = this.head
		this.head.prev = node
		this.head = node
		this.size ++
	}

	clear(){
		this.head = new ListNode<T>(null)
		this.tail = this.head
		this.size = 0

	}
}

export class ListNode<T> {
	next : ListNode<T> | null = null
	prev : ListNode<T> | null = null
	data : T | null
	constructor(data : T | null){
		this.data = data
	}
}