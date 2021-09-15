import {Observable, Subscriber} from 'rxjs'

export class Emiter<Topic extends number> {
  observers : Array<Array<Subscriber<any>>>

  constructor(){
    // 不会超过20个枚举了
    this.observers = new Array(50) 
  }

  addObserver(topic : Topic, observer : Subscriber<any>){
    if(!this.observers[topic]) {
      this.observers[topic] = []
    }
    const list = this.observers[topic]
    list.push(observer)
  }

  removeObserver(topic : Topic, observer : Subscriber<any>) {
    const list = this.observers[topic]
    if(list && list.length > 0) {
      this.observers[topic] = list.filter(x => x !== observer)
    }
  }


  on(topic : Topic | Topic[]) : Observable<any> {

    return new Observable<any>(observer => {

      const addedObservers : Array<[Topic, Subscriber<any>]> = []
      if(Array.isArray(topic)) {
        topic.forEach(t => {
          this.addObserver(t, observer)
          addedObservers.push([t,observer])
        })
      } else {
        this.addObserver(topic, observer)
        addedObservers.push([topic, observer])
      }


      return {
        unsubscribe: () => {
          addedObservers.forEach(
            x => this.removeObserver(x[0], x[1])
          )
          
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