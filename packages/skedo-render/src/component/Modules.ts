import React from 'react'
import * as skedoMeta from '@skedo/meta' 
const vue = require('vue')

export class Modules {

  static inst = new Modules()

  public static get() {
    return Modules.inst
  }

  resolve(name : string){
    console.log('resolve name:' + name)
    switch(name) {
      case 'react':
        return React
      case 'vue' :
        return vue
      case '@skedo/meta':
        return skedoMeta
      default:

				throw new Error(`unable to resolve ${name}.`)

    }

  }

}