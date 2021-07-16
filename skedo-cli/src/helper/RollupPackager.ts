import { ComponentMetaConfig } from '@skedo/core'
import { rollup, InputOptions, OutputOptions } from 'rollup'
import vue from 'rollup-plugin-vue'
// @ts-ignore
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
// @ts-ignore
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'


export default class RollupPackager {
	outputOptions : OutputOptions
	config :ComponentMetaConfig
	constructor(config : ComponentMetaConfig){


		this.outputOptions = {
			file: `build/${config.name}.js`,
			format: "amd",
			name : config.name 
		}
		this.config = config


	}
	async build() {
		try{
			const bundle = await rollup(this.getConfig(this.config)) 
			const {output} = await bundle.generate(this.outputOptions)

			for (const chunkOrAsset of output) {
				if (chunkOrAsset.type === 'asset') {
					console.log('Asset', chunkOrAsset.fileName)
				}
				else {
					console.log('Chunk', chunkOrAsset.fileName)
				}
			}
			await bundle.write(this.outputOptions)
			await bundle.close()
		}
		catch(ex) {
			console.log(ex)
		}
	}

	getConfig(config : ComponentMetaConfig) {
		if(config.type === 'vue') {
			const plugins = [
				vue(),
				typescript(),
				resolve({ 
					extensions : ['.js', '.ts', 'tsx', '.vue']
				}),
				babel({
					exclude: "node_modules/**",
					extensions: [".js", ".jsx",  ".tsx", ".ts"],
					babelHelpers: "bundled",
					presets : [
						["@babel/preset-env", { modules: false }, "@babel/preset-typescript"]
					]
				}),
				postcss({
					use :['sass']
				})
			]
			return {
				input: config.src,
				plugins,
				external : ['vue']
			}
		} else if(config.type === 'react') {
			const plugins = [
				postcss({
					modules:true,
					plugins:[]
				}),
				babel({
					presets : ["@babel/preset-react"]
				})
			]
			return {
				input: config.src,
				plugins,
				external : ['react']
			}
		}
		else {
			throw new Error("unsupported type:" + config.type)
		}

	}

}