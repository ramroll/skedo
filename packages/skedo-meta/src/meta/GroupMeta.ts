import { GroupConfig, PropConfig } from "./ComponentMeta"

export class GroupMeta {
	propKeys: Set<string>
  title : string
  style : any
	disabled? : boolean
	name : string

	constructor(){
		this.propKeys = new Set<string>()
		this.name = ''
		this.title = ''
		this.style = {}
	}

	static of(config : GroupConfig) {
		const group = new GroupMeta()
		group.name = config.name
		group.title = config.title
		group.disabled = config.disabled
		group.style = config.style
		if (config.props) {
      config.props.forEach((prop: PropConfig) => {
				if(prop.name) {
        	group.propKeys.add(prop.name)
				}
      })
    }
		return group
	}

	clone() {
		const g = new GroupMeta()
		g.name = this.name
		g.title = this.title
		g.style = this.style
		g.disabled = this.disabled
		g.propKeys = new Set([...this.propKeys])
		return g	
	}


	mergeGroup(group : GroupMeta) {
		const g = new GroupMeta()
		g.propKeys = new Set([...this.propKeys])
		group.propKeys.forEach(key => {
			g.propKeys.add(key)
		})
		return g
	}
}