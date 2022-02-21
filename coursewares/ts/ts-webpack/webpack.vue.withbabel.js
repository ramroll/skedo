const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
module.exports = {
	entry : {
		index : './src/main.ts'
	},
	mode : "development",
	module : {
		rules : [
			{
				test : /\.tsx?$/,
				loader : "babel-loader",
				options : {
					presets : [
						"@babel/preset-env",
						// "babel-preset-typescript-vue3",
						"@babel/preset-typescript",
					],
					plugins : [
						"@babel/plugin-vue-jsx"
					]
				},
				exclude : /node_modules/
			},
			{
				test : /\.vue$/,
				loader : 'vue-loader'
			}
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
		}),
		new VueLoaderPlugin()
	]
}