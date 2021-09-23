import { ComponentMetaConfig } from "@skedo/meta"
import { loadConfig } from "../helper/loadConfig"
import RollupPackager from "../helper/rollup/RollupPackager"
import Command from "../interface/Command"


export default class Rollup implements Command{
	name : string = 'rollup'

	async run(argv : any, config? : ComponentMetaConfig){
		const yml = argv.yml
		if(!config) {
			config = loadConfig(yml)
		}
		const rollupPackager = new RollupPackager(config , process.cwd())
		config.file = (await rollupPackager.build())!
	}
}
