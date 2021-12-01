import {SkedoContext} from '@skedo/runtime'

function mockFetch() {
  return Promise.resolve([...new Array(10)].map(() => {
    return {
      img : "https://img.kaikeba.com/35715171601202bhex.png",
      h1 : "保姆级高分公考"
    }
  }))
}
async function run(context : SkedoContext){  
  
  const lv = context.select("listview")
  const list = await mockFetch()
  console.log(list)
  lv.memory(list)
    
  
}
export default run