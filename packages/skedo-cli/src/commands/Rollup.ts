import { ComponentMetaConfig } from "@skedo/meta"
import { groupAndName } from "../helper/groupAndName"
import { loadConfig } from "../helper/loadConfig"
import RollupPackager from "../helper/rollup/RollupPackager"
import Command from "../interface/Command"


export default class Rollup implements Command{
	name : string = 'rollup'
	desc :string = "use rollup compile a component"

	async run(argv : any, config? : ComponentMetaConfig){
		const [group, name] = groupAndName(argv.groupAndName)
		if(!config)
			config = loadConfig(name)
		const rollupPackager = new RollupPackager(config , process.cwd())

		config.file = (await rollupPackager.build())!

	}
}
