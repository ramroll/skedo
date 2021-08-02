import { CordNew } from '@skedo/meta'
import {Rect} from '@skedo/utils'
import React from 'react'
import UIModel from '../../object/UIModel'


const RenderContext = React.createContext<{
	editor? : UIModel,
	cord : CordNew
}>({
	cord : new CordNew(Rect.ZERO),
})

export default RenderContext