import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default [{
  input: 'src/tmp/components/Tabs.vue',
  output: {
    file: 'build/tabs.js',
    format: "amd",
    name : "Tabs"
  },
  plugins : [

		vue(),
		typescript({
			lib: ["es5", "es6", "dom"],
			target: "es5", // 输出目标
			noEmitOnError: true, // 运行时是否验证ts错误
		}),
		resolve({ mainFields: ["module", "main", "browser"] }),
		babel({
			exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".vue"],
      babelHelpers: "bundled",
			presets : [
				["@babel/preset-env", { modules: false }]
			]
		}),
		postcss({
			use :['sass']
		})
  ],
	external : ["vue"]
}]