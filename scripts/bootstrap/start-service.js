const path = require('path')
const exec = require('child_process').exec
const chalk = require('chalk') 

const npm = exec("npm run dev", {
  windowsHide: true,
	env : {
		...process.env,
	}
})

npm.stdout.on('data', function (data) {
  console.log(data.toString());
});

npm.stderr.on('data', function (data) {
  console.log(chalk.red(data.toString()));
});