import {createClient} from 'redis'
class RedisNotify{
  
  private client
  constructor(){
    this.client = createClient()
  }
  async connect(){
    await this.client.connect()
  }

  async sendMessage(msg : string) {
    await this.client.lPush("tmp", msg)
  }

  async receiveMessage() {
    console.log(this.client.lRange)
    return await this.client.lPop('tmp')
  }

 
}

async function run(){
  const notify = new RedisNotify()
  await notify.connect()
  // await notify.sendMessage("abc")
  setInterval(async () => {
    const result = await notify.receiveMessage()
    console.log('update', result)
  }, 1000)

}

run()