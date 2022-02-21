const babel = require('@babel/core')
const plugin = require('./babel-plugin-closure-id').default
const { createFilter } = require('@rollup/pluginutils')

function closureIdPlugin(options) {
  return {
    name: 'closure-id',
    transform(code, id) {
      const {
        include,
        exclude,
      } = options

      const filter = createFilter(include || /\.[jt]sx?$/, exclude)

      if (filter(id)) {
        const plugins = [plugin(null, options, null)]
        const result = babel.transformSync(code, {
          babelrc: false,
          ast: true,
          plugins,
          sourceMaps: true,
          sourceFileName: id,
          configFile: false
        })

        console.log(result.code)
        return {
          code: result.code,
          map: result.map
        }
      }
    }
  }
}

module.exports = closureIdPlugin
closureIdPlugin.default = closureIdPlugin