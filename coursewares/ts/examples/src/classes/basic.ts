(() => {

  class Point {
    x: number
    y: number
      
    constructor(x : number, y : number){
        this.x = x
        this.y = y
    }

    public add(x : number, y : number) : Point;
    public add(p : Point) : Point;
    public add(x : number | Point, y? : number) {
      if(typeof x === 'number') {
          return new Point(this.x + x ,  this.y + y!)
      }
      const p = x
      return new Point(this.x + p.x, this.y + p.y)
    }
  }

  const p = new Point(0, 0)
  const newP = p.add(new Point(1, 1)).add(1, 2)
  console.log(newP)

})()