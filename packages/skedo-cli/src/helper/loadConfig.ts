import { ComponentMetaConfig, metaSchema } from "@skedo/meta/es"
import Yml from "./Yml"
import {Validator} from 'jsonschema'

export function validateConfig(config : ComponentMetaConfig) {
  const v = new Validator()
  const result = v.validate(config, metaSchema)

  if(result.errors.length > 0) {
    const error = result.errors[0]
    throw new Error(`validate error in yml file:` + error.stack)
  }
}

export function loadConfig(yml : string) :ComponentMetaConfig {
  try{
    if(!yml) {
      throw new Error("yml file path not specified.")
    }
	  const config : ComponentMetaConfig = Yml.loadYML(yml)
	  return config 
  }catch(ex) {
    throw ex
  }
}