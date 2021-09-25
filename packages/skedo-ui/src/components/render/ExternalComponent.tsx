import React, { useEffect, useRef } from 'react'
// import {Component as VueComponent, createApp} from 'vue'
import {Bridge, Node} from '@skedo/meta'
import styles from './render.module.scss'
import { componentRemote } from '@skedo/request'
import { Modules } from '@skedo/render'

interface ExternalComponentProps {
	url : string ,
	bridge : Bridge ,
	node: Node,
}
interface ExternalComponentState {
	C : React.ElementType<Props>,
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
				try{
					Modules.get().resolve('vue').createApp(Component, {bridge}).mount(elem)
				}
				catch(ex) {
					throw new Error(`run vue component ${bridge.getNode().getName()} error:` + ex.toString())
				}
			}
		},[])
		console.log('render vue component')
		return <div className={styles['vue-container']} ref={ref}>
		</div>
	}
}

export default class ExternalComponent extends React.Component<ExternalComponentProps, ExternalComponentState> {
	constructor(props : ExternalComponentProps){
		super(props)
		this.state = {
			C : () => null
		}


	}

	getComponent(text : string){
		// @ts-ignore
		function define(deps : Array<string>, callback : (...deps : Array<any>) => void){
			const depTypes = deps.map(stringName => {
				const modules = Modules.get()
				return modules.resolve(stringName)
			})
			return callback(...depTypes)
		}
		try{
			// @ts-ignore
			return eval(text)
		}
		catch(ex) {
			console.error(ex)
			// throw new Error("eval error:" + text)
			return null
		}
	}

	componentDidMount(){
		const self = this
		const componentType = this.props.node.meta.componentType

		const cache = this.props.node.meta.cache.get(this.props.url)
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

					if(componentType === 'react') {
						// eslint-disable-next-line
						const ComponentC = self.getComponent(text)

						node.meta.cache.set(node.meta.url!, ComponentC)
						console.log('build remove component--')
						self.setState({C : ComponentC})
					} else if(componentType === 'vue') {
						// eslint-disable-next-line
						const Component = self.getComponent(text)
						const VueComponentType = makeVueComponent(Component) 
						// const VueComponent = <VueComponentType bridge={self.props.bridge} />
						node.setRemoteCache(node.meta.url!, VueComponentType)
						self.setState({
							C : VueComponentType
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
		const C = this.state.C
		console.log('render---external', this.props.bridge.passProps())
		return <C bridge={this.props.bridge} />
	}
}
