import { ComponentMetaConfig } from "@skedo/meta"
import postcss from 'rollup-plugin-postcss'
// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { InputOptions, OutputOptions } from "rollup"
import replace from '@rollup/plugin-replace'
// @ts-ignore
import url from 'rollup-plugin-url'
import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import path from "path"


export class RollupConfig {

  config : ComponentMetaConfig
  cwd : string

  constructor(config : ComponentMetaConfig, cwd : string) {
    this.config = config
    this.cwd = cwd
  }


  public outputOptions() : OutputOptions {
		return {
			file: `build/${this.config.name}.js`,
			format: "amd",
			name : this.config.name 
		}
  }

  public inputOptions() : InputOptions{
    switch(this.config.componentType) {
      case 'react':
        return this.inputOptionsReact()
      case 'vue':
        return this.inputOptionsVue()
      default:
        throw new Error("unkown usage:" + this.config.componentType)
    }

  }

  private inputOptionsVue() : InputOptions{
    return {
      input : this.config.src, 
      plugins: this.pluginsForVue() 
    }
  }

  private inputOptionsReact() : InputOptions{
    return {
      input : this.config.src, 
      plugins: this.pluginsForReact(),
      external : ['react', 'react-dom']
    }
  }


  private pluginsForVue(){
    return [
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
  }

  private pluginsForReact(){
    const isProd = process.env.NODE_ENV === 'production'

    const plugins = [
      replace({
        preventAssignment : true,
        "process.env.NODE_ENV" : JSON.stringify(isProd ? 'production' : 'development')
      }),
      url({
        limit: 8 * 1024,
        include : ["**/*.svg"],
        emitFiles : true,
      }),
      resolve({
        extensions : ['js', 'jsx', 'ts', 'tsx']
      }),
      commonjs({
        include : "node_modules/**"
      }),
      postcss({
        use : ['sass']
      }),
      typescript({
        typescript: require('typescript'),
        tsconfig : path.resolve(this.cwd, "tmp-react.tsconfig.json"),
      })
    ]
    return plugins
  }
}