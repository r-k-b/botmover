'use strict'

const initialPlace = {x: undefined, y: undefined, orientation: undefined}

const orientations = ['n', 'e', 's', 'w']

const defaultSquare = {
  origin: {
    x: 0,
    y: 0,
  },
  catercorner: {
    x: 5,
    y: 5,
  },
}
exports.defaultSquare = defaultSquare

function setPlace(square, newPlace) {
  if (!pointLiesWithinSquare(square, newPlace)) {
    throw new Error('new place is outside the safe area')
  }
  return newPlace
}
exports.setPlace = setPlace

function pointLiesWithinSquare(square, point) {
  if (!isASquare(square)) {
    throw new TypeError('invalid `square` object passed')
  }
  if (!isAPoint(point)) {
    throw new TypeError('invalid `point` object passed')
  }

  const inX = square.origin.x <= point.x && point.x <= square.catercorner.x
  const inY = square.origin.y <= point.y && point.y <= square.catercorner.y

  return inX && inY
}
exports.pointLiesWithinSquare = pointLiesWithinSquare

function isASquare(x) {
  return !!(
    x &&
    x.origin &&
    isAPoint(x.origin) &&
    x.catercorner &&
    isAPoint(x.catercorner) &&
    x.origin.x <= x.catercorner.x &&
    x.origin.y <= x.catercorner.y
  )
}
exports.isASquare = isASquare

function isAPoint(x) {
  return (
    typeof x === 'object' && typeof x.x === 'number' && typeof x.y === 'number'
  )
}
exports.isAPoint = isAPoint

function isAPointWithOrientation(x) {
  return (
    typeof isAPoint(x) && orientations.includes(x.orientation)
  )
}
exports.isAPoint = isAPoint
