import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1623152998233_1723';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.security = {
    csrf : {
      enable : false
    }
  }

  config.cors = {
    origin: '*', 
    allowMethods : 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  config.multipart = {
    mode : "file"
  }
  
  config.oss = {
    client : {
      region: "oss-cn-shanghai",
      accessKeyId: "LTAItLcJaE7aPVkz",
      accessKeySecret: "pqNqqkkKFfD52CidAqIAFhXAkS85BC",
      bucket: "voice-static",
      timeout: 300000,
    }
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
