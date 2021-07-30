import React, {useState, useEffect} from 'react'

function useValue<T>(
	initialValue : ((() => T) | T), 
	onChange : ((v : T) => void)
) : [T, React.Dispatch<React.SetStateAction<T>>] {

	let ini : T = typeof initialValue === 'function' ? initialValue() : initialValue
	const [value, setValue] = useState<T>(ini)

	useEffect(() => {
		setValue(initialValue)
	}, [ini])

	useEffect(()=>{
		if(ini !== value) {
			onChange(value)
		}
	},[value])

	return [value, setValue]
}


export default useValue