import typescript from 'rollup-plugin-typescript2'
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { InputOptions, OutputOptions } from "rollup"
import path from 'path'


export class RollupConfig {


  cwd : string
  constructor(cwd : string) {
    this.cwd = cwd
  }

  public outputOptions() : OutputOptions {
		return {
			file: path.resolve(this.cwd, `build/index.js`),
			format: "amd",
			name : "index.js"
		}
  }


  public inputOptions() : InputOptions{
    return {
      input : path.resolve(this.cwd, "src/main.ts"), 
      plugins: this.plugins(),
      external : ["@skedo/runtime"]
    }
  }


  public plugins(){
    return [
      typescript({
        typescript : require('typescript'),
        tsconfig : path.resolve(this.cwd, "tsconfig.json")
      }),
      commonjs(),
      resolve({ 
        extensions : ['.ts']
      }),
    ]
  }
}