import {SkedoContext} from '@skedo/runtime'
async function run(ctx : SkedoContext){  
  ctx.select('txt').memory("改变后的文字!")
}
export default run