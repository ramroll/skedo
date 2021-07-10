const fs = require('fs')

const files = fs.readdirSync(`D:\\dev\\skedo\\skedo-ui\\node_modules\\@ant-design\\icons\\lib\\icons`)
	.filter(x => !x.match(/ts/))
	.map(x => x.split('.').shift())
	.forEach(x => {
		console.log(`- value:${x}`)
		console.log(`  text:${x}`)
	})

	


