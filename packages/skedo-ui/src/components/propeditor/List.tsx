import {  ListPropItemProps, PropComponentProps } from "./propeditor.types"
import {range} from 'ramda'
import classes from './prop-editor.module.scss'
import { useState } from "react"
import {lensPath, set, path} from 'ramda'

type ListProps = {
	minimum : number,
	children : Array<ListPropItemProps>,
	subItemRender : (type : string, props : PropComponentProps, key : any) => (JSX.Element | null)
}




const List = (props : ListProps & PropComponentProps) => {

	const [limit, setLimit] = useState(Math.max(props.minimum , (props.propValue ? props.propValue.length : 0)))

	function handleChange(path : Array<string | number>, v : any) {

		if(!props.propValue) {
			const arr : any = []
			props.onChange ( 
				set(lensPath(path), v, arr)
			)
		} else {
			const newPropValue = set(lensPath(path), v, props.propValue)
			props.onChange(newPropValue)
		}
	}

	function handleRemove(i : number) {
		props.propValue.splice(i, 1)
		props.onChange( props.propValue.slice() )
	}

	return (
    <div className={classes.list}>
      {range(0, limit).map((i) => {
				return (
          <div key={i} className={classes.row}>
						{props.children!.map( (item, j) => {
							return props.subItemRender(item.type, {
								onChange : (v) => handleChange(item.path(i), v),
								disabled : props.disabled,
								propValue : path(item.path(i), (props.propValue || [])) 
							}, i + "_" + j)
						})}
            <button 
							onClick={() => handleRemove(i)}
							className={classes["btn-remove"]}>
              x
            </button>
          </div>
        )
      })}

      <button onClick={() => setLimit(x => x + 1)} className={classes["btn-add"]}>+</button>
    </div>
  )
}

export default List