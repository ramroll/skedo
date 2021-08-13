import { PropComponentProps } from "./propeditor.types"
import {range} from 'ramda'
import useValue from "./useValue"
import classes from './prop-editor.module.scss'
import { useState } from "react"

type ListProps = {
	minimum : number,
	subItemRender : (props : PropComponentProps, key : any) => (JSX.Element | null)
}

const List = (props : ListProps & PropComponentProps) => {

	const [limit, setLimit] = useState(Math.max(props.minimum , (props.propValue ? props.propValue.length : 0)))

	console.log('render----', props.propValue)
	function handleChange(i :number, v : any) {

		if(!props.propValue) {
			const arr = []
			arr[i] = v
			props.onChange(arr)
		} else {
			props.propValue[i] = v
			props.onChange(props.propValue.slice())
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
            {props.subItemRender(
              {
                onChange: (v) => handleChange(i, v),
                propValue: (props.propValue || [])[i],
                disabled: props.disabled,
              },
              i
            )}
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