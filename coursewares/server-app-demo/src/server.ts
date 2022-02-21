
import express from 'express'
import { router } from './router'

const app = express()
router(app)
app.listen(4001, () => {
})