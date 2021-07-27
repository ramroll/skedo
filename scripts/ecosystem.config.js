const path = require('path')


module.exports = {
  apps : [{
    name   : "upd@7001",
    script : path.resolve(__dirname, "./start-service.js"),
		args :  "skedo-svc/upload 7001",
  }, {
    name : "doc@7002",
    script : path.resolve(__dirname, "./start-service.js"),
		args :  "skedo-svc/doc 7002",
  }]
}