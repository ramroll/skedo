import {Bridge, Node} from '@skedo/core'

export type NodeRenderProps = {
	node : Node,
	inheritProps? : any
}

export type RenderedComponentProps = {
	bridge : Bridge
}
