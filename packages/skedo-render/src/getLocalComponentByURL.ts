
const localComponentsMap: {
  [key: string]: Function 
} = {}  

import React from 'react'
import Button from './local/Button'
// // @ts-ignore
// require.context('./local', true, /\.tsx$/)
// 	.keys()
// 	.forEach( (key : string) => {
// 		key = key.replace('./', '')
// 		const [a,] = key.split('.')
// 		localComponentsMap['local.' + a] = require(`./local/${key}`).default
// 	})

import Div from './local/Div'
import Icon from './local/Icon'
import Image from './local/Image'
import Input from './local/Input'
import Page from './local/Page'
import Text from './local/Text'

localComponentsMap['local.Div'] = Div
localComponentsMap['local.Icon'] = Icon 
localComponentsMap['local.Image'] = Image 
localComponentsMap['local.Input'] = Input 
localComponentsMap['local.Page'] = Page 
localComponentsMap['local.Text'] = Text 
localComponentsMap['local.Button'] = Button 

function getLocalComponentByURL(url: string) : React.ComponentType {
	return localComponentsMap[url] as React.ComponentType || null
}

export default getLocalComponentByURL
