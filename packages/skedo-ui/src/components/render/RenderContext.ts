import { Cord, CordNew, Rect } from '@skedo/core'
import React from 'react'
import EditorModel from '../../object/EditorModel'


const RenderContext = React.createContext<{
	editor? : EditorModel,
	cord : CordNew
}>({
	cord : new CordNew(Rect.ZERO),
})

export default RenderContext