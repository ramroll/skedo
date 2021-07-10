export interface JsonWidgetTree {
  group : string,
  type : string,
  rect : number[],
  style? : any,
  mode? :string,
  passProps? : any,
  children? : Array<JsonWidgetTree>
}
