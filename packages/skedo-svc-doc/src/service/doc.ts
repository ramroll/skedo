import { Doc } from "@skedo/dao" 

type ParamsDictionary = {
  [key : string] : any
}
export class DocService {

  type :string
  params? : ParamsDictionary 

  constructor(type : string, params? : ParamsDictionary) {
    this.type = type
    this.params = params 
  }

  private idx(){
    const params = this.params
    if(params) {
      return (
        this.type +
        "." +
        Object.keys(params)
          .map((x) => params[x])
          .join(".")
      )
    }
    throw new Error("Cannot call idx() when no params.")
  }


  public async put(values : any) {
    const idx = this.idx() 
    const one = await Doc.findOne({
      where : {
        idx
      }
    })

    if(one) {
      await one.update({
        doc : values
      })
      //await one.save()
    } else {
      const doc = new Doc({
        type : this.type,
        idx,
        doc : values
      })
      await doc.save()
    }
  }

  public async get() : Promise<Doc | Array<Doc> | null> {
    if(!this.params) {
      const list = await Doc.findAll({
        where : {
          type : this.type
        }
      })
      return list.map(x => {
        return x["doc"]
      })
    } else {
      const idx = this.idx()
      const one = await Doc.findOne({
        where : {
          idx  
        }
      })
      return one ? one['doc'] : null
    }
  }

  public async delete(){
    const doc = await Doc.findOne({
      where : {
        idx : this.idx(),
      }
    })
    await doc?.destroy()
  }

	
}