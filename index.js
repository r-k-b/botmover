'use strict'

const {readCommand} = require('./lib/input')
const {log} = require('./lib/output')

readCommand()
  .then(cmd => {
    log.info({cmd}, 'command received')
  })
  .catch(error => {
    log.error({error}, 'readCommand() failed')
  })
