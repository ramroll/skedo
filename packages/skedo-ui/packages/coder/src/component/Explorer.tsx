import Icons from './Icons'

import classes from './explorer.module.css'
type ExplorerProps = {
	fileList : Array<string>
}


export default ({fileList} : ExplorerProps) => {

	return <div className={classes.explorer}>
		<ul>
			{fileList.map(file => {
				const ext = file.split('.').pop() || ''
				const Icon = Icons[ext]

				return (
					<li key={file}>
						<Icon />
						<span>{file}</span>
					</li>
				)
			})}
		</ul>
	</div>

}