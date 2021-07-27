import { CordNew, Rect } from '@skedo/core'
import React from 'react'
import UIModel from '../../object/UIModel'


const RenderContext = React.createContext<{
	editor? : UIModel,
	cord : CordNew
}>({
	cord : new CordNew(Rect.ZERO),
})

export default RenderContext