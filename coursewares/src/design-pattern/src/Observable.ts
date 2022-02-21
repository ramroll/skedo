type Observer<T> = (val : T) => void

export class Observable<T> {

  observers : Observer<T>[] = []
  subscribe(observer : Observer<T>) {
    this.observers.push(observer)
  }

  queue : T[] = []

  dispatch(msg : T) {

    this.queue.unshift(msg)

    // for(let ob of this.observers) {
    //   await ob(msg)
    // }
    let I = null

    I = setTimeout(async () => {
      const lastMsg = this.queue.pop()
      for(let ob of this.observers) {
        await ob(lastMsg)
      }
    })
    // this.observers.forEach(ob => ob(msg))
  }
}

// class Emiter {}

const x = new Observable<string>()

// x : Observable
//
x.subscribe(val => {
  console.log(val)
})

class A {
  b : B

  constructor(){
    this.b.subscribe((action) => {
      if(action.type === "method2-called") {
        // ...
      }

    })
  }

  method1(){
    this.b.method2()
  }
}


type Action = {
  type : string,
  data : any
}
class B extends Observable<Action> {
  // a : A

  method2(){
    this.dispatch({
      type : "method2-called",
      data : null
    })
    // this.a.method1()
  }
}

// Rx.js

// Kafka / MetaQ / RabbitMQ

 
