import { createContext } from 'react'
import { CordNew, Rect } from '@skedo/core'
const RenderContext = createContext({
	cord : new CordNew(Rect.ZERO)
})

export default RenderContext