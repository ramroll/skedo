import { Bridge } from "@skedo/core"

import classes from './component.module.scss'


interface ImageProps {
  img : string,
  bridge : Bridge
}

const Image = ({img, bridge} : ImageProps) => {
	return <img className={classes.img} src={img} /> 
}

export default Image