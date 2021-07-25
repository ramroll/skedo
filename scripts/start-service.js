const path = require('path')
const exec = require('child_process').exec
const chalk = require('chalk') 
const svc = process.argv[2]
const port = process.argv[3] 
if(!svc) {
	console.log(`service ${svc} not found.`)
	process.exit()
}
if(!port) {
	console.log(`port should be specified.`)
	process.exit()
}

const npm = exec("npm run dev", {
  windowsHide: true,
	env : {
		...process.env,
		PORT : port,
	},
  cwd: path.resolve(__dirname, `../packages/${svc}`),
})

npm.stdout.on('data', function (data) {
  console.log(data.toString());
});

npm.stderr.on('data', function (data) {
  console.log(chalk.red(data.toString()));
});