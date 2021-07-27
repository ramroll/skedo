
const localComponentsMap : {[key:string] : React.ComponentClass} = {}  

// @ts-ignore
require.context('../localComponents', true, /\.tsx$/)
	.keys()
	.forEach( (key : string) => {
		key = key.replace('./', '')
		const [a,] = key.split('.')
		localComponentsMap['local.' + a] = require(`../localComponents/${key}`).default
	})


function getLocalComponentByURL(url: string) : React.ComponentClass {
	return localComponentsMap[url] || null
}

export default getLocalComponentByURL
