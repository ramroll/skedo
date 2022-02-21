import {Request, Response, Express} from 'express'
import { Application } from '../Application'



enum HTTPMethod {
  GET,
  POST,
  DELETE,
  PUT
}


export class HelloController {

  @restful(HTTPMethod.GET, "/")
  index(req : Request, res : Response){

    res.send("ok")
  }

}

type UserInfo = {
  name : string
}
class UserServer {

  async updateUser(userId : number, name : string) {
    // ...
  }
}
export class UserController {

  @restful(HTTPMethod.PUT, "/user/:id")
  async index(req : Request, res : Response){
    const id = req.params.id
    const json = req.body

    const userService = new UserServer()
    await userService.updateUser(parseInt(id), json.username)
    res.send("ok")
  }

}

// type HTTPMethod = "POST" | "GET" | "PUT" | "DELETE" | "OPTIONS" | "PATCH"
function restful(method : HTTPMethod, path : string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log(target)

    const application = Application.getCurrentApplication()
    switch(method) {
      case HTTPMethod.GET:
        application.getExpress().get(path, descriptor.value.bind(target))
        break
    }
  }

}