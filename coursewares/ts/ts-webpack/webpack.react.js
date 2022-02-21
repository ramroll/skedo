const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry : {
		index : './src/ReactHello.tsx'
	},
	mode : "development",
	module : {
		rules : [
			{
				test : /\.tsx?$/,
				use : "ts-loader",
				exclude : /node_modules/
			},
		]
	},
	resolve : {
		extensions :['.tsx', '.ts', '.js']
	},
	output : {
		filename : "bundle.[name].js",
		path : path.resolve(__dirname, "dist")
	},
	devServer : {
		contentBase : path.resolve(__dirname, "dist"),
		port : 3020
	},
	plugins : [
		new HtmlWebpackPlugin({
			template : path.resolve(__dirname, "template.html")
		})
	]
}