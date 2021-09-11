import {Random, mock} from 'mockjs'
export function fn1(){
  return [
    "apple",
    "google",
    "qq",
    "ali"
  ] 
}

export function fn2() {
  return Random.ctitle()
}

export function news(){
  return [...Array(10)].map(() => {
    return {
      title : Random.ctitle(),
      img : Random.image()
    }
  })
}