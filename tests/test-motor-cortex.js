'use strict'

const tape = require('tape')

const {
  pointLiesWithinSquare,
  defaultSquare,
  isAPoint,
  isASquare,
} = require('../lib/motor-cortex')

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
