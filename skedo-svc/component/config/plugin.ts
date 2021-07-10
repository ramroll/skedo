import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  cors : {
    enable : true,
    package : "egg-cors"
  }
}

export default plugin;
