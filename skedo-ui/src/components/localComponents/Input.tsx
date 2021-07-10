import style from './component.module.scss'


interface IptProps {
	multiline : string 
}
const Ipt = ({multiline} : IptProps) => {
	if(multiline === 'on') {
		return <textarea className={style.textarea} onMouseDown={e => e.preventDefault()} />
	}
	else {
		return <input className={style.input} onMouseDown={e => e.preventDefault()} />
	}
}

export default Ipt