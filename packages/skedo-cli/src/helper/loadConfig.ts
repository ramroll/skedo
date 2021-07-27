import { ComponentMetaConfig } from "@skedo/core"
import Yml from "./Yml"

export function loadConfig(name : string) {
	const ymlFile = name + '.skedo.yml'
	const config : ComponentMetaConfig = Yml.loadYML(ymlFile)
	return config 
}