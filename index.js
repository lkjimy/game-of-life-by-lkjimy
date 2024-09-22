'use strict'

/**
 * John Conway's Game of Life
 *
 * RULES:
 *
 * 1. Each cell with one or no neighbors dies, as if by solitude.
 *
 * 2. Each cell with four or more neighbors dies, as if by overpopulation.
 *
 * 3. Each cell with two or three neighbors survives.
 *
 * 4. Each cell with three neighbors becomes populated.
 */

// Globals
const domDisplay = document.getElementById('display')
const canvasSize = 1000
const gridSize = 100
const blockSize = canvasSize / gridSize
let generation = 0

const canvas = document.getElementById('canvas')
canvas.height = canvasSize
canvas.width = canvasSize
const canvasContext = canvas.getContext('2d', { alpha: false })

let isPaused = true
let timer = undefined
const playPause = document.getElementById('playPause')
playPause.addEventListener('click', toggleTimer)

let tool = true
const toolbtn = document.getElementById('tool')
toolbtn.innerText = tool ? 'paint' : 'erase'
toolbtn.addEventListener('click', () => {
  tool ? (toolbtn.innerText = 'erase') : (toolbtn.innerText = 'paint')
  tool = !tool
})

// Generates the Array's 1D
const currentState = new Array(gridSize).fill(0)
const newState = new Array(gridSize).fill(0)

// generates the Array's 2D
for (let row = 0; row < gridSize; row++) {
  currentState[row] = new Array(gridSize).fill(0)
  newState[row] = new Array(gridSize).fill(0)
}

// populates the currentState with random 1's and 0's
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    currentState[row][col] = Math.round(Math.random())
  }
}

function adjustCoord(value) {
  if (value >= gridSize) {
    return value - gridSize
  } else if (value < 0) {
    return value + gridSize
  } else {
    return value
  }
}

// function to generate the newState based on the the currentState
function generateNewState() {
  let neighbours = 0

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const ref = currentState[row][col]

      // scan neighbourhood
      if (currentState[adjustCoord(row - 1)][adjustCoord(col - 1)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row - 1)][adjustCoord(col)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row - 1)][adjustCoord(col + 1)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row)][adjustCoord(col - 1)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row)][adjustCoord(col + 1)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row + 1)][adjustCoord(col - 1)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row + 1)][adjustCoord(col)]) {
        neighbours++
      }

      if (currentState[adjustCoord(row + 1)][adjustCoord(col + 1)]) {
        neighbours++
      }

      // check for vitals of ref
      if (ref && (neighbours <= 1 || neighbours >= 4)) {
        newState[row][col] = 0
      } else if (ref && neighbours >= 2 && neighbours <= 3) {
        newState[row][col] = 1
      } else if (!ref && neighbours === 3) {
        newState[row][col] = 1
      } else {
        newState[row][col] = ref
      }

      neighbours = 0
    }
  }

  for (let index = 0; index < gridSize; index++) {
    currentState[index] = Array.from(newState[index])
  }

  generation++
}

// function to render the currentState
function render() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (currentState[row][col]) {
        canvasContext.fillStyle = '#FFF'
        canvasContext.fillRect(
          col * blockSize,
          row * blockSize,
          blockSize,
          blockSize
        )
      } else {
        canvasContext.fillStyle = '#000'
        canvasContext.fillRect(
          col * blockSize,
          row * blockSize,
          blockSize,
          blockSize
        )
      }
    }
  }
}

// function to paint the canvas with a click
function paint(event) {
  const row = Math.floor(event.offsetY / blockSize)
  const col = Math.floor(event.offsetX / blockSize)
  currentState[row][col] = tool ? 1 : 0
  render()
}

function removeListeners() {
  canvas.removeEventListener('mousemove', paint)
  canvas.removeEventListener('mouseup', removeListeners)
}

function mouseDown(event) {
  paint(event)
  canvas.addEventListener('mousemove', paint)
  canvas.addEventListener('mouseup', removeListeners)
}

function toggleTimer() {
  if (isPaused) {
    isPaused = !isPaused
    canvas.removeEventListener('mousedown', mouseDown)

    timer = setInterval(() => {
      const start = performance.now()
      generateNewState()
      render()
      const end = performance.now()
      domDisplay.innerText = `Generation: ${generation}\n ${end - start}ms`
    }, 100)
  } else {
    isPaused = !isPaused
    clearInterval(timer)
    canvas.addEventListener('mousedown', mouseDown)
  }
}

toggleTimer()
