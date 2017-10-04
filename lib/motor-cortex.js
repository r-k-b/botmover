'use strict'

const {log} = require('./output')

const orientations = ['N', 'E', 'S', 'W'] // in clockwise order.

const commands = ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT']

const validRotationAngles = [-1, 1]

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

/**
 *
 * @param square
 * @param oldPointWithOrientation
 * @param command
 * @return {square, point}
 */
function receiveCommand(square, oldPointWithOrientation, command) {
  const commandIsValid = isValidCommand(command)

  if (!commandIsValid) {
    log.warn({invalidCommand: command})
    throw new TypeError('invalid command passed')
  }

  const commandType = command.type

  if (!isASquare(square)) {
    throw new TypeError('invalid `square` object passed')
  }

  const pointProvided = oldPointWithOrientation !== undefined

  if (pointProvided) {
    if (!isAPointWithOrientation(oldPointWithOrientation)) {
      throw new TypeError('invalid `point` object passed')
    }
  }

  let hasBeenPlaced = false
  try {
    hasBeenPlaced = pointLiesWithinSquare(square, oldPointWithOrientation)
  } catch (error) {}

  if (commandType !== 'PLACE' && !hasBeenPlaced) {
    log.warn('robot has not yet been placed; ignoring command.')
    return oldPointWithOrientation
  }

  switch (commandType) {
    case 'REPORT':
      log.info({currentPosition: oldPointWithOrientation}, 'reporting.')
      return oldPointWithOrientation

    case 'LEFT':
      if (!pointProvided) {
        log.warn('cannot rotate an undefined point')
        return oldPointWithOrientation
      }
      const newPointL = rotate(-1, oldPointWithOrientation)
      log.info('rotated left.')
      return newPointL

    case 'RIGHT':
      if (!pointProvided) {
        log.warn('cannot rotate an undefined point')
        return oldPointWithOrientation
      }
      const newPointR = rotate(1, oldPointWithOrientation)
      log.info('rotated right.')
      return newPointR

    case 'MOVE':
      if (!pointProvided) {
        log.warn('cannot move from an undefined point')
        return oldPointWithOrientation
      }
      try {
        const newPoint = move(square, oldPointWithOrientation)
        log.info('moved forward.')
        return newPoint
      } catch (error) {
        log.warn('cannot move there.')
        return oldPointWithOrientation
      }

    case 'PLACE':
      try {
        const newPoint = setPlace(square, command.placeAt)
        return newPoint
      } catch (error) {
        log.warn('cannot place robot there.')
        return oldPointWithOrientation
      }

    default:
      throw new Error('unrecognised command')
  }
}
exports.receiveCommand = receiveCommand

function rotate(angle, point) {
  if (!isAPointWithOrientation(point)) {
    throw new TypeError('invalid `point` object passed')
  }
  if (!validRotationAngles.includes(angle)) {
    throw new TypeError('invalid `angle` passed')
  }

  const oldOrientationIndex = orientations.indexOf(point.orientation)
  const newOIndex = mod(oldOrientationIndex + angle, 4)
  const newOrientation = orientations[newOIndex]
  return {
    x: point.x,
    y: point.y,
    orientation: newOrientation,
  }
}
exports.rotate = rotate

function move(square, point) {
  if (!isAPointWithOrientation(point)) {
    throw new TypeError('invalid `point` object passed')
  }
  if (!isASquare(square)) {
    throw new TypeError('invalid `square` object passed')
  }

  let newPoint = Object.assign({}, point)
  switch (point.orientation) {
    case 'N':
      newPoint.y = newPoint.y + 1
      break
    case 'S':
      newPoint.y = newPoint.y - 1
      break
    case 'E':
      newPoint.x = newPoint.x + 1
      break
    case 'W':
      newPoint.x = newPoint.x - 1
      break
    default:
      throw new Error('unrecognised point orientation')
  }

  return setPlace(square, newPoint)
}
exports.move = move

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
  return isAPoint(x) && orientations.includes(x.orientation)
}

exports.isAPoint = isAPoint

function mod(n, m) {
  return (n % m + m) % m
}

function isValidCommand(x) {
  const passesBasic = !!(
    typeof x === 'object' &&
    typeof x.type === 'string' &&
    commands.includes(x.type)
  )
  if (!passesBasic) {
    return false
  }
  if (passesBasic && x.type !== 'PLACE') {
    return true
  }

  return isAPointWithOrientation(x.placeAt)
}
