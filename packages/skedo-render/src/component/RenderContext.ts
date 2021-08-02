import { createContext } from 'react'
import { CordNew } from '@skedo/meta'
import { Rect } from '@skedo/utils'
const RenderContext = createContext({
	cord : new CordNew(Rect.ZERO)
})

export default RenderContext