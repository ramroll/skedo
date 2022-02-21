const path = require('path')
module.exports = {
	entry : {
		index : './src/index.ts'
	},
	mode : "development",
	module : {
		rules : [
			{
				test : /\.ts$/,
				use : "ts-loader",
				exclude : /node_modules/
			}
		]
	},
	resolve : {
		extensions :['.tsx', '.ts', '.js']
	},
	output : {
		filename : "bundle.[name].js",
		path : path.resolve(__dirname, "dist")
	}
}