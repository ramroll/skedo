import { rollup } from 'rollup'
import { RollupConfig } from './RollupConfig'

export class RollupPackager {

  cwd : string
	constructor(cwd : string){
		this.cwd = cwd
	}


	public async build() {

		try{
				
			const config = new RollupConfig(this.cwd)
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
			console.log(ex)
		}

	}
}