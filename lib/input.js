'use strict'

const inquirer = require('inquirer')

const inputErrors = {
  UNRECOGNIZED: 'unrecognised command.',
}
exports.inputErrors = inputErrors

async function readCommand() {
  const question = {
    type: 'input',
    name: 'text',
    message: 'command >',
    validate: validateCommand,
  }
  const command = await inquirer.prompt(question)
  return command.text
}
exports.readCommand = readCommand

const commands = [
  /^PLACE\s+(\d+)\s*,\s*(\d+)\s*,\s*(N(?:ORTH)?|E(?:AST)?|S(?:OUTH)?|W(?:EST)?)$/,
  /^MOVE$/,
  /^LEFT$/,
  /^RIGHT$/,
  /^REPORT$/,
]

function validateCommand(command) {
  const normalisedCommand = normaliseInput(command)
  const results = commands.map(regex => regex.test(normalisedCommand))
  const anyPass = results.reduce(or, false)
  if (anyPass) {
    return true
  }

  return 'unrecognised command.'
}
exports.validateCommand = validateCommand

function normaliseInput(input) {
  const isString = typeof input === 'string'
  if (!isString) {
    const error = new TypeError('cannot normalise this input type')
    error.suppliedType = typeof input
    throw error
  }
  const trimmed = input.trim()
  const upped = trimmed.toUpperCase()
  return upped
}
exports.normaliseInput = normaliseInput

function or(a, b) {
  return a || b
}
exports.or = or
