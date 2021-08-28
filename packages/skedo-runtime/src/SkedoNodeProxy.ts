import { Node, SkedoEventName, Topic } from "@skedo/meta"
import { SkedoEvent, SkedoEventHandler } from "./type"

export class SkedoNodeProxy {

  private node : Node
  private events : Record<string, Array<SkedoEventHandler>>

  constructor(node : Node){
    this.node = node
    this.events = {}

    this.node.on(Topic.ExternalEventNotify)
      .subscribe((evt : SkedoEvent) => {
        if(this.events[evt.type]){
          this.events[evt.type].forEach(h => {
            h(evt)
          })
        }

      })
  }

  public on(eventName : SkedoEventName, handler: SkedoEventHandler) {
    let topic = this.events[eventName]
    if(!topic) {
      topic = this.events[eventName] = []
    }
    topic.push(handler)

    return () => {
      this.events[eventName] = this.events[eventName]
        .filter(x => x !== handler)
    }
  }

  public memory(data : any) {
    this.node.memory(data)
  }
}