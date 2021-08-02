import {Bridge, Node} from '@skedo/meta'

export type NodeRenderProps = {
	node : Node,
	inheritProps? : any
}

export type RenderedComponentProps = {
	bridge : Bridge
}
