import { SkedoComponentProps } from '@skedo/meta'
import ListRender from './ListRender'
export default ({bridge} : SkedoComponentProps) => {
	console.log('inner div...')
	return <ListRender bridge={bridge} />
}