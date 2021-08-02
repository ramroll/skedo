import { SkedoComponentProps } from '@skedo/meta'
import useListenChildrenUpdate from '../../hooks/useListenChildrenUpdate'
import classes from './component.module.scss'
import ListRender from './ListRender'
export default ({bridge} : SkedoComponentProps) => {
	useListenChildrenUpdate(bridge.getNode())
	return <ListRender bridge={bridge} />
}