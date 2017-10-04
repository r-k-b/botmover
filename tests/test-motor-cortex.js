'use strict'

const tape = require('tape')

const {
  pointLiesWithinSquare,
  defaultSquare,
  isAPoint,
  isASquare,
  receiveCommand,
} = require('../lib/motor-cortex')
const {parseCommand} = require('../lib/input')

tape.test('is a point', t => {
  t.equal(isAPoint({x: 1, y: 1}), true)
  t.end()
})

tape.test('is a square', t => {
  const invertedSquare = {
    origin: defaultSquare.catercorner,
    catercorner: defaultSquare.origin,
  }

  t.equal(isASquare(defaultSquare), true)
  t.equal(
    isASquare(invertedSquare),
    false,
    'squares must satisfy simplifying assumptions',
  )
  t.end()
})

tape.test('plws', t => {
  const square = defaultSquare
  const plws = pointLiesWithinSquare

  t.equal(plws(square, {x: 3, y: 3}), true)
  t.equal(plws(square, {x: 0, y: 0}), true)
  t.equal(plws(square, {x: 5, y: 5}), true)

  t.throws(() => plws('square', {x: 3, y: 3}))
  t.throws(() => plws(square, '{x:3,y:3}'))

  t.equal(plws(square, {x: 3, y: 6}), false)
  t.equal(plws(square, {x: 6, y: 3}), false)
  t.equal(plws(square, {x: -1, y: 3}), false)
  t.equal(plws(square, {x: 3, y: -1}), false)
  t.end()
})

tape.test('place function', t => {
  const square = defaultSquare
  const targetPoint = {
    x: 0,
    y: 0,
    orientation: 'N',
  }
  const command = {
    type: 'PLACE',
    placeAt: targetPoint,
  }

  t.deepEqual(receiveCommand(defaultSquare, undefined, command), targetPoint)

  const oobTarget = {
    x: -3,
    y: 4,
    orientation: 'N',
  }
  const badCommand = {
    type: 'PLACE',
    placeAt: oobTarget,
  }

  t.deepEqual(receiveCommand(defaultSquare, undefined, badCommand), undefined)

  t.end()
})

tape.test('example command sequences', t => {
  // A
  t.deepEqual(
    executeCommands(
      defaultSquare,
      ['PLACE 0,0,NORTH', 'MOVE', 'REPORT'],
      undefined,
    ),
    {x: 0, y: 1, orientation: 'N'},
  )

  // B
  t.deepEqual(
    executeCommands(
      defaultSquare,
      ['PLACE 1,2,EAST', 'MOVE', 'MOVE', 'LEFT', 'MOVE', 'REPORT'],
      undefined,
    ),
    {x: 3, y: 3, orientation: 'N'},
  )

  t.end()
})

function executeCommands(table, commands, initialPosition) {
  return commands.reduce(
    (botPosition, cmd) => receiveCommand(table, botPosition, parseCommand(cmd)),
    initialPosition,
  )
}
