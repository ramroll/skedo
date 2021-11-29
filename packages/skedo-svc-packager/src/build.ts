import path from 'path'
import {RollupPackager} from '@skedo/code-tools'

const rollup = new RollupPackager(path.resolve(__dirname, "../tmp"))

async function run() {
  await rollup.build()
}

run()