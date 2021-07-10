import React, { useEffect, useRef } from 'react'
// import {Component as VueComponent, createApp} from 'vue'
import {Bridge} from '@skedo/core'
import styles from '../style/core.module.scss'
import { componentRemote } from '@skedo/request'
const vue = require('vue')

interface ExternalComponentProps {
	url : string ,
	bridge : Bridge ,
	componentType : 'react' | 'vue',
}
interface ExternalComponentState {
	C : React.ElementType<Props> | null ,
}

interface Props {
	bridge : Bridge
}

function makeVueComponent(Component : any) : React.ElementType<Props> {
	
	return ({bridge} : Props) => {
		const ref = useRef<HTMLDivElement>(null)
		useEffect(() => {
			const elem = ref.current
			if(elem) {
				vue.createApp(Component, {bridge}).mount(elem)
			}
		},[])
		return <div className={styles['vue-container']} ref={ref}>
		</div>
	}
}

export default class ExternalComponent extends React.Component<ExternalComponentProps, ExternalComponentState> {
	constructor(props : ExternalComponentProps){
		super(props)
		this.state = {
			C : null
		}


	}

	componentDidMount(){
		const self = this
		const {componentType} = this.props

		componentRemote.external.get(this.props.url)
			.then(text => {
				(function(){
					// eslint-disable-next-line
					function define(deps : Array<string>, callback : (...deps : Array<any>) => void){
						const depTypes = deps.map(stringName => {
							switch(stringName) {
								case 'react':
									return React
								case 'vue':
									return vue 
								default:
									throw new Error(`${stringName} not installed.`)
							}
						})
						return callback(...depTypes)
					}
					if(componentType === 'react') {
						// eslint-disable-next-line
						const Component = eval(text)
						self.setState({C : Component})
					} else if(componentType === 'vue') {
						// eslint-disable-next-line
						const Component = eval(text)
						self.setState({
							C : makeVueComponent(Component)  
						})
					} else {
						/// TODO : normalize component type in meta config 
						throw new Error("Unkonw component Type")
						
					}
				})()
			}) 
	}

	render(){
		if(this.state.C === null) {
			return null
		}
		return <this.state.C bridge={this.props.bridge} />
	}
}
