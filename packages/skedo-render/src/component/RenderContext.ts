import { createContext } from 'react'
import { CordNew, Page } from '@skedo/meta'
import { Rect } from '@skedo/utils'

type RenderContextType = {
	cord : CordNew,
	page? : Page 
}
export const RenderContext = createContext<RenderContextType>({
	cord : new CordNew(Rect.ZERO)
})
