import {useState, useEffect} from './hooks'

export default () => {

	const [count, setCount] = useState(0)

	useEffect(() => {
		setTimeout(() => {
			setCount(x => x + 1)
		}, 1000)
	}, [count])

	return <div>
		<h1>{count}</h1>
		<button onClick={() => setCount(x => x + 1)}>add</button>
	</div>

}

