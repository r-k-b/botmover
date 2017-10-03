'use strict'

const {readCommand, normaliseInput} = require('./lib/input')
const {log} = require('./lib/output')

main().catch(error => {
  log.error({error}, 'main() failed')
})

async function main() {
  while (true) {
    const cmd = normaliseInput(await readCommand())
    log.info({cmd})
  }
}
