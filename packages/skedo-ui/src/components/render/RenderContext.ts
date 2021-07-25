import { Cord, CordNew, Rect } from '@skedo/core'
import React from 'react'



const RenderContext = React.createContext<CordNew>(new CordNew(Rect.ZERO))

export default RenderContext