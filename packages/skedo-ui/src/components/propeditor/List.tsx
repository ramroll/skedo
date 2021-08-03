import { PropComponentProps } from "./propeditor.types"
import {range} from 'ramda'
import useValue from "./useValue"

type ListProps = {
	minimum : number,
	subItemRender : (props : PropComponentProps) => (JSX.Element | null)
}

const List = (props : ListProps & PropComponentProps) => {

	const [value, ] = useValue<Array<any>>(props.propValue || [], props.onChange)


	function handleChange(i :number, v : any) {
	}

	return (
    <div>
      {range(0, props.minimum).map((i) => {
        return props.subItemRender({
					onChange : (v) => handleChange(i, v),
					propValue : value[i],
					disabled : props.disabled
				})
      })}
    </div>
  )
}

export default List