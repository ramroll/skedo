import fs from 'fs'
import yaml from 'js-yaml'
export default class Yml {
  static search() {
    return fs
      .readdirSync("./")
      .filter((x) => x.match(/\.skedo\.yml$/))
  }

	
  static loadYML(file: string) : any {
    return yaml.load(fs.readFileSync(file, "utf-8"))
  }

}