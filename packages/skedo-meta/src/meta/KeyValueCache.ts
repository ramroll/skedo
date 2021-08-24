export class KeyValueCache<TValue> {

  data : Record<string, TValue>

  constructor(){
    this.data = {}
  }

  public set(key : string, val : TValue) {
    this.data[key] = val 
  }

  public get(key : string) {
    return this.data[key] || null
  }


}