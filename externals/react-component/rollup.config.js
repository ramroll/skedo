import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'

export default [{
  input: 'src/Swiper.jsx',
  output: {
    file: 'build/Swiper.js',
    format: "amd",
    name : "Swiper"
  },
  plugins : [
    postcss({
      modules:true,
      plugins:[]
    }),
    babel({
      presets : ["@babel/preset-react"]
    })
  ]
}]