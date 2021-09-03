const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, "../src/index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../build"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

	module : {
		rules : [
			{
				test : /\.tsx?$/,
				use : {
					loader : 'babel-loader',
					options : {
						presets : [
							"@babel/preset-typescript",
							"@babel/preset-react",
							"@babel/preset-env",
						],
						plugins : ["@babel/plugin-transform-runtime"]
					}
				},
				exclude : /node_modules/
			},
			{
				test : /\.(ya?ml)$/,
				exclude: /node_modules\/(?!@skedo)/,
				type : "json",
				loader: "yaml-loader"
			},
			{
        test: /\.scss$/i,
				use : [
					"css-loader",
					{
						loader : "postcss-loader"
					},
					"sass-loader",
				]
			}
		]
	},
  devServer : {
    contentBase : path.resolve(__dirname, "../build"),
    port : 3003
  },
  plugins : [
    new HtmlWebpackPlugin({
      template : path.resolve(__dirname, "../index.html")
    })
  ]
}