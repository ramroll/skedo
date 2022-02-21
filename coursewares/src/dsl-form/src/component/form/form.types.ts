export type FormDSL = {
  type : string,
  defaultValue? : any,
  name ? : any,
  path? : (string | number)[],
  hooks? : {
    onDataChange ? : (key : string, value : any, context : any) => void
  },
  props? : any,
  children? : FormDSL[]
}