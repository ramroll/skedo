import React, {useState, useEffect} from 'react'

function useValue<T>(
	initialValue : ((() => T) | T), 
	onChange : ((v : T) => void)
) : [T, React.Dispatch<React.SetStateAction<T>>] {

	if(typeof initialValue === 'function') {
		initialValue = (initialValue as Function)()
	}

	const [value, setValue] = useState<T>(initialValue)

	// useEffect(() => {
	// 	setValue(initialValue)
	// }, [initialValue])

	useEffect(()=>{
		if(initialValue !== value) {
			onChange(value)
		}
	},[value])

	return [value, setValue]
}


export default useValue