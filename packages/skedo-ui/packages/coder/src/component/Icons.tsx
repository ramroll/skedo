import React from 'react'
const Icons : {
	[key : string] : React.ComponentClass
} = {}
require
	// @ts-ignore
	.context("./icons", true, /\.tsx$/)
	.keys()
	.forEach((file : string) => {
		file = file.replace('./', '')
		const Com = require('./icons/' + file).default
		const iconName = file.split('.')[0]
		Icons[iconName] = Com
	})

export default Icons

