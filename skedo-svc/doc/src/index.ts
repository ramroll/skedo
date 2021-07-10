import express from 'express'
import chalk from 'chalk'
import routers from './routers'
const app = express()

routers(app)
const port = 7002
app.listen(port, () => {
	console.log(chalk.greenBright(`successfully listen at ${port}`))
})