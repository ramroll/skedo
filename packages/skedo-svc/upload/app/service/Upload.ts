import { Service, Context } from 'egg';
import { EggFile } from 'egg-multipart'
const {Readable} = require('stream')
const fs = require('fs')
const crypto = require('crypto')


/**
 * Test Service
 */
export default class Test extends Service {

  public async upload(file : EggFile, ctx : Context<any>) {
    const ext = file.filename.split('.').pop()
    const sha1sum = crypto.createHash('sha1').update(fs.readFileSync(file.filepath))
      .digest('hex')
    const filename = `/img/${sha1sum}.${ext}`
    await ctx.oss.put(filename, file.filepath)
    return {
      success : true,
      data : `https://voice-static.oss-accelerate.aliyuncs.com${filename}`,
    }
  }

  public async uploadContent(file : string, content : string, ctx : Context<any>) {
    const stream = new Readable()
    stream.setEncoding('utf-8')
    stream.push(content)
    stream.push(null)
    let fileName =  file
    await ctx.oss.putStream(fileName, stream)

    if(fileName[0] !== '/')  {
      fileName = '/' +fileName
    }
    
    return {
      success : true, 
      data : `https://voice-static.oss-accelerate.aliyuncs.com${fileName}` 
    }
  }

  public async uploadJson(path : string, file : string, content : string, ctx : Context<any>) {
    const stream = new Readable()
    stream.setEncoding('utf-8')
    stream.push(content)
    stream.push(null)
    let fileName = path +  '/' + file
    await ctx.oss.putStream(fileName, stream)
    
    if(fileName[0] !== '/')  {
      fileName = '/' +fileName
    }
    
    return {
      success : true,
      data : `https://voice-static.oss-accelerate.aliyuncs.com${fileName}` 
    }
  }
}
