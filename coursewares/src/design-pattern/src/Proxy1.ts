
class Form<T> {

  constructor(private data : T){
  }

  get(key : string) {
    return this.data[key]
  }
}


function createForm<T>(data : T) {

  const form = new Form(data)
  return new Proxy(form, {
    get(target, key){
      if(key === 'a') {
        return form.get(key)
      }

    },
    set(target, key, value){
      return true 
    }
  }) as any as {
    [K in keyof T] : T[K] 
  }
}

const form = createForm({
  a : 1,
  b : "x"
})


form.a