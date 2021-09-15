
import devConfig from './config.dev'
import prodConfig from './config.prod'

console.log('config', process.env.NODE_ENV, prodConfig)
const config =
  process.env.NODE_ENV === "production"
    ? prodConfig
    : devConfig

export default config