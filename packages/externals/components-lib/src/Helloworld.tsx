import React from 'react'
import classes from './hello.module.scss'
import {Bridge} from '@skedo/meta'
export default ({bridge} : {bridge : Bridge}) => {
  const props = bridge.passProps()
  return <h2 className={classes.hello}>{props.text}</h2>
}