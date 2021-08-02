import { Node, NodeData } from '@skedo/meta'
import {LinkedList, ListNode, Logger} from '@skedo/utils'


export interface HistoryItem {
	node : Node,
	from : NodeData,
	to : NodeData,
	name : string 
}

export class History extends LinkedList<Array<HistoryItem>> {
  current: ListNode<Array<HistoryItem>> | null = this.head
  logger: Logger = new Logger("history")
  stacked: Array<HistoryItem> = []
  I: any = null

  startTransaction() {
    if (this.stacked.length > 0) {
      this.commit()
    }
    this.stacked = []
  }

  rollback() {
		this.__rollbackPack(this.stacked.concat())
		this.stacked = []
	}

  discard(){
    this.stacked = []
  }

  record(historyItem: HistoryItem) {
    this.current = this.head
    this.stacked.push(historyItem)
  }

  commit() {
    if(this.stacked.length === 0) {
      return
    }
    this.push(this.stacked.concat())
    this.current = this.head
    this.stacked = []
  }

  __rollbackPack(pack: Array<HistoryItem>) {
    const reversed = pack.concat().reverse()
    const finalState: { [key: string]: HistoryItem } = {}
    reversed.forEach((item) => {
      finalState[item.node.getId()] = item
    })

    for (let item of Object.values(finalState)) {
      item.node.updateData(item.from)
    }
  }

  backward() {
    this.logger.debug("backward", this.current)
    if (this.current) {
      const pack = this.current.data
      this.current = this.current.next
      if (pack !== null) {
				this.__rollbackPack(pack)
      }
    }
  }

  print() {
    let p: ListNode<Array<HistoryItem>> | null = this.head
    while (p && p !== this.tail) {
      console.log(p?.data)
      p = p.next
    }
  }

  clear(){
    super.clear()
    this.stacked = []
  }
}