

function myFetch(str : string) {

  console.log(str)
  return Promise.resolve('response from :' + str)

}


function asyncRunner(fn : () => Generator<any>){
  console.log('async runner')
  const it = fn()
  console.log('before----')
  const nextReturn1 = it.next()
  // console.log({nextReturn1})
  // const nextReturn2 = it.next(nextReturn1)
  // console.log({nextReturn2})
}

function * request(){
  console.log(1)
  const x = yield myFetch("https://www.baidu.com")
  console.log(2, x)
  yield myFetch("https://www.sina.com")
  console.log(3)
}

asyncRunner(request)
