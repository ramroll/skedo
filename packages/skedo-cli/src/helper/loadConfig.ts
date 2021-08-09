import { ComponentMetaConfig, metaSchema } from "@skedo/meta"
import Yml from "./Yml"
import {Validator} from 'jsonschema'

function validateConfig(config : ComponentMetaConfig) {
  const v = new Validator()
  const result = v.validate(config, metaSchema)

  if(result.errors.length > 0) {
    const error = result.errors[0]
    throw new Error(`validate error in yml file:` + error.stack)
  }
}

export function loadConfig(name : string) {
	const ymlFile = name + '.skedo.yml'
	const config : ComponentMetaConfig = Yml.loadYML(ymlFile)
	validateConfig(config)
	return config 
}