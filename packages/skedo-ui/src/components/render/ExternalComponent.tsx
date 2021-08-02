import React, { useEffect, useRef } from 'react'
// import {Component as VueComponent, createApp} from 'vue'
import {Bridge, Node} from '@skedo/meta'
import styles from './render.module.scss'
import { componentRemote } from '@skedo/request'
const vue = require('vue')

interface ExternalComponentProps {
	url : string ,
	bridge : Bridge ,
	node: Node,
}
interface ExternalComponentState {
	C : JSX.Element | null ,
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
		const componentType = this.props.node.meta.type

		const cache = this.props.node.getRemoteCache(this.props.url)
		if(cache) {
			console.log('use remote cache' ,cache)
			this.setState({
				C : cache 
			})
			return
		}
		
		
		const node = this.props.node
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
						const ComponentC = eval(text)
						const ReactComponent = <ComponentC bridge={self.props.bridge} />

						node.setRemoteCache(node.meta.url!, ReactComponent)
						console.log('build remove component--')
						self.setState({C : ReactComponent})
					} else if(componentType === 'vue') {
						// eslint-disable-next-line
						const Component = eval(text)
						const VueComponentType = makeVueComponent(Component) 
						const VueComponent = <VueComponentType bridge={self.props.bridge} />
						node.setRemoteCache(node.meta.url!, VueComponent)
						self.setState({
							C : VueComponent 
						})
					} else {
						/// TODO : normalize component type in meta config 
						console.error("Unkown componnet Type", node.getName())


						
					}
				})()
			}) 
	}

	render(){
		if(this.state.C === null) {
			return null
		}
		return this.state.C
		// return <this.state.C bridge={this.props.bridge} />
	}
}
