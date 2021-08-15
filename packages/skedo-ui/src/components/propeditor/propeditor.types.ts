export type ListPropItemProps = {
  type : string,
	path : (i : number) => Array<number | string>
}

export type ListPropItem = {
  type : string,
	name : string
}


export type PropComponentProps = {
	metaProps? : any,
	disabled : boolean,
	propValue : any,
	row? : Array<ListPropItem>
	onChange : (v : any) => void 
}