import type {Express} from 'express'
import path from 'path'
import fs from 'fs'
import { createClient } from 'redis'




interface ICache {
  set(key : string, value : string) : void;
  get(key : string) : Promise<string>;
}

class Cache implements ICache{
  static inst : Cache = new Cache()
  client = createClient()

  constructor(){
    this.client.on("error", (err : any) => {
      throw err
    })
    this.connect()
  }

  async connect(){
    await this.client.connect();
  }

  public static getCache() {
    return this.inst
  }
  public async get(key : string) : Promise<string> {
    return this.client.get(key) 
  }

  public async set(key : string, value : string) {
    await this.client.set(key, value)
  }

  
}


// 无状态服务
export function router(app : Express) {
  app.get('/', async (req, res) => {
    let html = await Cache.getCache().get('index.html')
    console.log('get from cache', html)

    if(!html) {
      console.log('set cache')
      html = fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf-8')
      await Cache.getCache().set("index.html", html)
    }
    res.send(html)
  })

  app.get('/xyz', (req, res) => {
    res.send("ok1")
  })
}
