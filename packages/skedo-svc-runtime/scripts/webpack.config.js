const path = require("path");
const fs = require('fs')

function devServer(){
	return {
		devServer : {
			static : path.resolve(__dirname, '../build'),
			port : 3003,
			onBeforeSetupMiddleware : function(devServer) {
				devServer.app.get('/', (req, res) => {
					const str = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf-8')
					res.send(str)
				})
			}
		}
	}
}

function devPlugins(){
	return [
	]
}

module.exports = {
  entry: path.resolve(__dirname, "../src/index.tsx"),
	mode : "development",
	devtool : "eval",	
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../build"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
		alias : {
			react : path.resolve(__dirname, '../node_modules/react'),
			"react-dom" : path.resolve(__dirname, '../node_modules/react-dom')
		}
  },
	...devServer(),
  module: {
    rules: [
      {
        test: /.tsx?/,
        use: {
          loader: "babel-loader",
					options : {
						presets : [
							[
								"@babel/preset-react",
								{
									runtime : "automatic"
								}
							],
							"@babel/preset-env",
							"@babel/preset-typescript",
						],
						plugins : [
							"@babel/plugin-transform-runtime"
						]
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
        test: /\.module\.scss$/i,
				use : [
					{
						loader : 'style-loader'
					},
					{
						loader : "css-loader",
						options : {
							modules : true,
							importLoaders : 1
						}
					},
					{
						loader : "sass-loader"
					}
				]
			}
    ],
  },
	plugins : [
		...devPlugins()
	]
}