import React, {useState, useEffect} from 'react'
import PropItem from '../../object/PropItem'

function useValue<T>(initialValue : (() => T | T), prop : PropItem) : [T, React.Dispatch<React.SetStateAction<T>>] {

	let ini : T = typeof initialValue === 'function' ? initialValue() : initialValue
	const [value, setValue] = useState<T>(ini)

	useEffect(() => {
		setValue(prop.value)
	}, [prop.value])

	useEffect(()=>{
		if(value !== null && prop.value !== value) {
			prop.set(value)
		}
	},[value])

	return [value, setValue]
}


export default useValue