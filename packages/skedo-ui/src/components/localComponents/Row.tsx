import { Bridge } from '../../../../skedo-core/src'
import classes from './component.module.scss'
import ListRender from './ListRender'
const Row = ({bridge} : {bridge : Bridge}) => {
	return <div className={classes.row}>
		<ListRender bridge={bridge} childrenProps={{
			style : {
				position : ""
			}
		}} />
	</div>
}

export default Row