import Command from "../interface/Command";
import fs from 'fs'
import path from 'path'
import UI from "../helper/UI";
import yaml from 'js-yaml'
import FatalError from "../helper/FatalError";
import {fileRemote, componentRemote, CustomResponse} from '@skedo/request'
import { loadConfig, validateConfig } from "../helper/loadConfig";
import Rollup from "./Rollup";
import { ComponentMetaConfig } from "@skedo/meta";


export default class Publish implements Command {
  name: string = "publish"
  format: string = "publish [groupAndName]"
  desc: string = "publish component"
  ui: UI

  constructor() {
    this.ui = UI.getUI()
  }

  private async uploadImageIfNeed(config : ComponentMetaConfig){
    if(!config.imageUrl) {

      if(!config.image) {
        throw new Error("please check image field in your yml file.")
      }

    config.imageUrl = (
      await fileRemote.post2(
        fs.createReadStream(config.image)
      )
    ).data
    }
  }

  async run(argv: any) {
    this.ui.info("Publish Component to Skedo")
    const config = loadConfig(argv.yml)

    const ymlName = path.basename(argv.yml)
    await this.uploadImageIfNeed(config)
	  validateConfig(config)
    // build
    this.ui.info("开始打包...")
    const rollup = new Rollup()
    await rollup.run(argv, config)

    await this.checkTarget(config)

    const json = await fileRemote.post1(
      config.group,
      "js",
      fs.readFileSync(config.file, "utf-8")
    )

    if(json.success === false) {
      throw new Error(json.message)
    }
    config.url = json.data
    this.ui.info("url:" + config.url)
    this.ui.info("Upload file to oss success.")
    const finalConf = yaml.dump(config)
    config.yml = (await fileRemote.post1(
      `${config.group}`,
      "yml",
      finalConf,
    )).data

    // 传sqlite
    const result = await this.submit(config)
    if(!result.success) {
      throw result.message
    }
    this.ui.success("Success Publish Component.")
    fs.writeFileSync(
      argv.yml,
      finalConf,
      "utf-8"
    )

    this.ui.success("Successfully update yml file.")
  }

  private checkTarget(config: ComponentMetaConfig) {

    if (!fs.existsSync(config.image)) {
      throw new FatalError(`Component image not exists.`)
    }
    if (!fs.existsSync(config.file)) {
      throw new FatalError(
        `Component file ${config.file} not exists.`
      )
    }

    this.ui.success("Success check yml format.")
  }

  private async submit(config: ComponentMetaConfig) : Promise<CustomResponse>  {
    const result = await componentRemote.put(config.group, config.name, {
      group: config.group,
      name : config.name,
      image: config.image,
      author: config.author,
      description: config.description,
      version: config.version,
      url: config.url,
      yml: config.yml, 
    })
    if(!result.success) {
      throw new Error("doc service error:" + result.message)
    }
    return result
  }

}
