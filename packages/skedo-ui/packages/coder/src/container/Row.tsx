import { ReactElement } from "react"

type RowProps = {
	children : React.ReactElement | Array<ReactElement> | null
}
export default ({children} : RowProps) => {
	return <div style={{
		display :'flex',
		flexDirection : 'row',
		height : '100%'
	}}>
		{children}
	</div>
}