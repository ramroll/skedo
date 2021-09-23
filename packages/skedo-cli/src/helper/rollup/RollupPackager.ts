import { ComponentMetaConfig } from '@skedo/meta'
import path from 'path'
import fs from 'fs'
import { rollup } from 'rollup'
import { RollupConfig } from './RollupConfig'

export default class RollupPackager {
	private config :ComponentMetaConfig
	private cwd : string

	constructor(config : ComponentMetaConfig, cwd : string){
		this.cwd = cwd
		this.config = config
	}

	private tmpConfigPath(){
		return path.resolve(this.cwd, `tmp-${this.config.componentType}.tsconfig.json`)
	}

	private createTmpTSConfig(){
		const content = fs.readFileSync(
      path.resolve(
        __dirname,
        `../../../resource/tmp-${this.config.componentType}.tsconfig.json`
      ),
      "utf-8"
    )
		fs.writeFileSync(this.tmpConfigPath(), content, 'utf8') 
	}

	private rmTmpTsConfig(){
		fs.unlinkSync(this.tmpConfigPath())
	}

	public async build() {

		try{
				
			this.createTmpTSConfig()
			const config = new RollupConfig(this.config, this.cwd)
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
		finally {
			this.rmTmpTsConfig()
		}
	}
}