'use strict'

const tape = require('tape')

const {validateCommand, normaliseInput, inputErrors} = require('../lib/input')

tape.test('normaliser', t => {
  const ni = normaliseInput
  t.equal(ni('foo'), 'FOO')
  t.equal(ni(' foo '), 'FOO')
  t.equal(ni(' foo  bar'), 'FOO  BAR')
  t.throws(() => ni({foo: 'bar'}))
  t.end()
})

tape.test('commands', t => {
  const vc = validateCommand

  t.equal(vc('LEFT'), true)
  t.equal(vc('Left '), true)
  t.equal(vc(' LEFT '), true)
  t.equal(vc('LERFT'), inputErrors.UNRECOGNIZED)
  t.throws(() => vc({foo: 'bar'}))
  t.equal(vc('right'), true)
  t.equal(vc('move'), true)
  t.equal(vc('report'), true)
  t.equal(vc('place'), inputErrors.UNRECOGNIZED)
  t.equal(vc('place 1'), inputErrors.UNRECOGNIZED)
  t.equal(vc('place 1,2'), inputErrors.UNRECOGNIZED)
  t.equal(vc('place 1,2,N'), true)
  t.equal(vc('place 1,2,NORTH'), true)
  t.equal(vc('place 1,2,NOR'), inputErrors.UNRECOGNIZED)

  t.end()
})
