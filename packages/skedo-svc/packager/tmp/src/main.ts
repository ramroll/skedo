import {SkedoContext} from '@skedo/runtime'

async function fetchData(){
  return [{
    text : "你好"
  }, {
    text : "这是"
  }, {
    text : "列表"
  }, {
    text : "哈哈"
  }, {
    text : "!!!!"
  }]
}

async function run(ctx : SkedoContext){
  const node = ctx.select("listview")

  const data = await fetchData()
  node.memory(data)  
  
}
export default run