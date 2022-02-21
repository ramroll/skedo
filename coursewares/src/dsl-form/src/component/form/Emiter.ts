type Handler = (data : any) => void
export class Emiter {
  
  private topics : Map<string, Handler[]> = new Map()

  private getTopic(topic : string) : Handler[] {

    if(!this.topics.get(topic)) {
      this.topics.set(topic, [])
    }
    return this.topics.get(topic)!
  }

  on(topic : string, handler : Handler) {
    const handlers = this.getTopic(topic)
    handlers.push(handler)
    return () => {
      this.topics.set(topic, this.getTopic(topic).filter(x => x !== handler))
    }
  }

  emit(topic : string, data? : any){
    this.getTopic(topic).forEach(h => {
      h(data)
    })
  }
}