export class Rect {
  left:number
  top:number
  width : number
  height : number

  constructor(left : number, top : number, width : number, height:number){
    this.left = left 
    this.top = top 
    this.width = width
    this.height = height
  }

  static of (left : number, top : number, width : number, height:number) : Rect {
    return new Rect(left, top,width, height)
  }

  copyFrom(rect:Rect) :void {
    this.left = rect.left;
    this.top = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  right() : number{
    return this.left + this.width
  }

  bottom() : number{
    return this.top + this.height
  }

  boundX(x : number){
    return this.left <= x && this.right() >= x
  }

  boundY(y : number) : boolean{
    return this.top <= y && this.bottom() >= y 
  }

  bound(x : number, y : number) : boolean{
    return this.boundX(x) && this.boundY(y)
  }

  contains(rect : Rect) : boolean {
    return this.left <= rect.left
      && this.right() >= rect.right()
      && this.top <= rect.top 
      && this.bottom() >= rect.bottom()
  }

  area() : number {
    return this.width * this.height
  }

  intersect(rect : Rect) : Rect | null {
    const lmax = Math.max(rect.left, this.left)
    const rmin = Math.min(rect.right(), this.right())
    const tmax = Math.max(rect.top, this.top)
    const bmin = Math.min(rect.bottom(), this.bottom())

    if(lmax >= rmin || tmax >= bmin) {
      return null
    }

    return new Rect(lmax, tmax, rmin - lmax, bmin - tmax)
  }

  apply( x : number, y : number, width : number, height : number ) : Rect {
    const rect = this.clone()
    rect.left += x
    rect.top += y
    rect.width += width
    rect.height += height
    return rect
  }

  replace( rect : Rect ) {
    this.left = rect.left
    this.top = rect.top
    this.width = rect.width
    this.height = rect.height
  }

  clone(){
    return new Rect(this.left, this.top, this.width, this.height)
  }

  centerX(){
    return this.left + this.width / 2
  }

  centerY() {
    return this.top + this.height / 2
  }

  equals(left : number, top : number, width : number, height : number) {
    return this.left === left && this.top === top && this.width === width && this.height === height
  }

  static ZERO = new Rect(0, 0, 0, 0)
}
