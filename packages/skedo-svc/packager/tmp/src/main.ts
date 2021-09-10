import {SkedoContext} from '@skedo/runtime'
async function run(ctx : SkedoContext){

  ctx.loaded(() => {
    ctx.select('txt').memory("你好!")
  })
  
}
export default run