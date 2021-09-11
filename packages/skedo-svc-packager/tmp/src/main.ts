import {SkedoContext} from '@skedo/runtime'
async function run(ctx : SkedoContext){

  let list = []
  const listview = ctx.select('view')
  async function fetchData(){
    const resp = await fetch("http://localhost:7005/faas/default?fn=news")
    const json = await resp.json()   
    list = list.concat(json.data)
    listview.memory(list)   
  }
  

  ctx.onMessage((msg) => {
    if(msg === 'load-more') {
      fetchData()
    }
  })

  ctx.prepare(async () => {
    // listview.setProp('fetchData', fetchData)
  })  
}
export default run