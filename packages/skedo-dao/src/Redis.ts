import {createClient} from 'redis'
import config from '@skedo/svc-config'
export class Redis {

  private static inst : Redis
  private client = createClient({
    socket : {
      host : config.redisHost,
      port : config.redisPort
    }
  }) 

  private constructor(){}

  public static getInst() {
    if(!Redis.inst) {
      Redis.inst = new Redis() 
    }
    return Redis.inst
  }

  public async connect(){
    if(this.client.isOpen) {
      this.client.connect()
    }
  }

  public async getClient(){
    await this.connect() 
    return this.client
  }
}