import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default [{
  input: 'src/components/Tabs.vue',
  output: {
    file: 'build/tabs.js',
    format: "amd",
    name : "Tabs"
  },
  plugins : [
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
  ],
	external : ["vue"]
}]