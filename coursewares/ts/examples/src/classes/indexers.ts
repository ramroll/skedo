(() => {

  class Arr<T> {
    [i : number] : T
  }

  const a = new Arr<number>()
  a[10] = 100
  console.log(a[10])

  class A {

    x : number
    foo(){
      
      const y = 0
      class B{
        bar(){
          this.x // Property 'x' does not exist on type 'B'
          console.log(y)
        }
      }
      return B
    }
}
})()