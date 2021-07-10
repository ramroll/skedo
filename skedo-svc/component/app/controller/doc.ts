import { Controller } from 'egg';
import Doc from '../dao/Doc';



export default class DocController extends Controller {

  private idx(type : string, params : Array<string>){
    return type + "." + params.map(key => this.ctx.params[key]).join('.')
  }

  public async index(){
    return async () => {

    }

  }

  public async put(type : string, params : Array<string>) {
    const idx = this.idx(type, params) 
    const values = ctx.request.body

    const one = await Doc.findOne({
      where : {
        idx
      }
    })

    if(one) {
      await one.update({
        values
      })
    } else {
      await Doc.create({
        type,
        idx,
        doc : values
      })
    }
    ctx.body = {
      success : true
    }
  }



  public async get(type : string, params? : Array<string>) {

    return async () => {
      if(!params) {
        const list = await Doc.findAll({
          where : {
            type
          }
        })
        this.ctx.body = {
          success :true,
          data : list
        }
      } else {
        const one = await Doc.findOne({
          where : {
            idx :  this.idx(type, params) 
          }
        })
        
        this.ctx.body = {
          success : true,
          data : one
        }
      }
    }

  }

  public async delete(type : string, params : Array<string>){
    return async () => {
      const doc = await Doc.findOne({
        where : {
          idx : this.idx(type, params),
        }
      })
      await doc?.destroy()
      this.ctx.body = {
        success :true
      }
    }

  }
}
