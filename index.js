'use strict'

const {readCommand, parseCommand} = require('./lib/input')
const {log} = require('./lib/output')
const {defaultSquare, receiveCommand} = require('./lib/motor-cortex')

const table = defaultSquare

main().catch(error => {
  log.error({error}, 'main() failed')
})

async function main() {
  let botPosition
  while (true) {
    try {
      const cmd = parseCommand(await readCommand())
      botPosition = receiveCommand(table, botPosition, cmd)
    } catch (error) {
      log.error({error})
    }
  }
}
