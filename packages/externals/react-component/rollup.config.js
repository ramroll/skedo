import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'

export default [{
  input: 'src/Swiper.tsx',
  output: {
    file: 'build/swiper.js',
    format: "amd",
    name : "Swiper"
  },
  plugins : [
    typescript(),
    postcss({
      modules:true,
      plugins:[]
    }),
    babel({
      presets : ["@babel/preset-react"]
    })
  ]
}]