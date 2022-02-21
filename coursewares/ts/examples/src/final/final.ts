
type Unwrap<T> = T extends Promise<infer U> ? U : T

type p = Unwrap<Promise<number>>

type RouteDic<Arg extends string> = {
  [p in Arg] : string
} 
type RouteParams<Route extends string> = 
  Route extends `${string}:${infer Rest}`
    ? RouteDic<Rest> 
    : never 
  
const path = "/a/:page"
const params : RouteParams<typeof path> = {
  'page' : 'abc'
} 

c



export {}