import { PropComponentProps } from "./propeditor.types"
import classes from './prop-editor.module.scss'
import { useEffect, useState } from "react"
import {lensPath, set, path} from 'ramda'

type ListProps = {
	minimum : number,
	subItemRender : (type : string, props : PropComponentProps, key : any) => (JSX.Element | null)
}


function getPath(i : number, name ? : string){
	return name ? [i, name] : [i]
}

const List = (props : ListProps & PropComponentProps) => {


  const [list, setList] = useState(
    () => {
      let list = props.propValue
      if(!list) {
        list = new Array(props.minimum)
      }
      return list as Array<any>

    }
  )


  useEffect(() => {
    props.onChange(list)
  }, [list])

	function handleChange(path : Array<string | number>, v : any) {
    setList((list) => {
      const newList = set(lensPath(path), v, list)
      return newList
    })
	}

	function handleRemove(i : number) {
    setList((list) => {
      return list.filter((_ ,j) => i !== j)
    })
	}

	return (
    <div className={classes.list}>
      {list.map((_ : any, i : number) => {
				return (
          <div key={i} className={classes.row}>
						{props.children!.map( (item, j) => {
							return (
                <div key={j}>
									<label>{item.label}</label>
                  {props.subItemRender(
                    item.type!,
                    {
                      onChange: (v) =>
                        handleChange(
                          getPath(i, item.name),
                          v
                        ),
                      disabled: props.disabled,
                      propValue: path(
                        getPath(i, item.name),
                        props.propValue || []
                      ),
                    },
                    i + "_" + j
                  )}
                </div>
              )
						})}
            <button 
							onClick={() => handleRemove(i)}
							className={classes["btn-remove"]}>
              x
            </button>
          </div>
        )
      })}

      <button onClick={() => setList(list => {
        return list.concat(undefined)
      })} className={classes["btn-add"]}>+</button>
    </div>
  )
}

export default List