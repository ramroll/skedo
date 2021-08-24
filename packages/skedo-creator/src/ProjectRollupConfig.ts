import { projPathResolve } from "./resolver"
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { InputOptions, OutputOptions, RollupWatchOptions } from "rollup"
import replace from '@rollup/plugin-replace'
// @ts-ignore
import url from 'rollup-plugin-url'

type RollupUsage = "dev" | "build"
export default class ProjectRollupConfig {

  usage : RollupUsage
  constructor(usage : RollupUsage) {
    this.usage = usage
  }

  private inputOptions() : InputOptions{
    return {
      input : projPathResolve("src/main.tsx"), 
      plugins : this.plugins()
    }
  }

  private plugins(){
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
      resolve(),
      commonjs({
        include : "node_modules/**"
      }),
      postcss({
        plugins :[]
      }),
      typescript({
        tsconfig : projPathResolve("tsconfig.json")
      })
    ]

    return plugins
  }

  outputOptions() : OutputOptions{
    return {
      file : projPathResolve('build/bundle.js'),
      format : 'cjs',
      sourcemap : process.env.node_env !== 'production'
    }
  }

  watchOptions() : RollupWatchOptions{
    return {
      ...this.inputOptions(),
      output : this.outputOptions(),
      watch : {
        include: projPathResolve("src/**")
      }
    }
  }
  
}