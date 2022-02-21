
@b()
export class A {

}

function b(){
  return (Target : any) => {
    // return B
    return class C {
      foo(){
        console.log("c.foo")
      }
    }
  }
}




const a = new A()

export {}