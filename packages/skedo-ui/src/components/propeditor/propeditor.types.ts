import { PropConfig, PropMeta } from "@skedo/meta"

export type ListPropItemProps = {
  type : string,
	path : (i : number) => Array<number | string>
}


export type PropComponentProps = {
	metaProps? : any,
	disabled : boolean,
	propValue : any,
	children ? : Array<Partial<PropConfig>>
	onChange : (v : any) => void 
}