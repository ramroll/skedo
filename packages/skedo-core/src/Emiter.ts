import {Observable, Subscriber} from 'rxjs'



export class Emiter<Topic extends number> {
  observers : Array<Array<Subscriber<any>>>

  constructor(){
    // 不会超过20个枚举了
    this.observers = new Array(20) 
  }

  on(topic : Topic) : Observable<any> {
    return new Observable<any>(observer => {
      if(!this.observers[topic]) {
        this.observers[topic] = []
      }
      const list = this.observers[topic]
      list.push(observer)
      return {
        unsubscribe: () => {
          this.observers[topic] = list.filter(o => o !== observer)
        },
      }
    })
  }

  emit(topic :Topic , data? : any) :void {
    if(this.observers[topic]) {
      this.observers[topic].forEach(observer => {
        observer.next(data)
      })
    }
  }
}