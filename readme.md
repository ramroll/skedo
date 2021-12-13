安装前置依赖
```shell
npm install ts-node -g
npm install pm2 -g
```

启动步骤

```shell
yarn install
npm run reinstall

# 安装数据库表
ts-node packages\skedo-dao\src\force_build_db.ts

# 安装低代码模板
# ts-node packages\skedo-code-tools\src\scripts\upload_templates.ts

npm start
```


