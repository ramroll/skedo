
import devConfig from './config.dev'
import prodConfig from './config.prod'


const config = process.env.NODE_ENV === 'production' 
 ? prodConfig : devConfig

export default config