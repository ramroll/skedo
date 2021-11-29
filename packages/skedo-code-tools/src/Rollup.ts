import { rollup } from 'rollup'
import { RollupConfig } from './RollupConfig'
import {execSync} from 'child_process'

export class RollupPackager {

  cwd : string
	constructor(cwd : string){
		this.cwd = cwd
	}


	private preBuild(){

		execSync("yarn link @skedo/runtime", {
			cwd : this.cwd
		})
	}

	public async build() {

		this.preBuild()

		try{
				
			console.log('start building')
			const config = new RollupConfig(this.cwd)
			console.log(config.inputOptions())
			const bundle = await rollup(config.inputOptions())
			const {output} = await bundle.generate(config.outputOptions())

			for (const chunkOrAsset of output) {
				if (chunkOrAsset.type === 'asset') {
					console.log('Asset', chunkOrAsset.fileName)
				}
				else {
					console.log('Chunk', chunkOrAsset.fileName)
				}
			}
			await bundle.write(config.outputOptions())
			await bundle.close()
			return config.outputOptions().file 

		}
		catch(ex) {
			console.log("rollup build error")
			console.log(ex)
			throw ex
		}

	}
}