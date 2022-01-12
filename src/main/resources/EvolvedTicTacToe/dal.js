function Move(row, col, type) {
  return bp.Event(type, { row: row, col: col })
}

function X(row, col) {
  return Move(row, col, 'X')
}

function O(row, col) {
  return Move(row, col, 'O')
}

var move = bp.EventSet('Move events', function (e) {
  //return e instanceof Move;
  return e.name == 'X' || e.name == 'O'
})

var Xmove = bp.EventSet('X events', function (e) {
  //return e instanceof Move;
  return e.name == 'X'
})

var Omove = bp.EventSet('O events', function (e) {
  //return e instanceof Move;
  return e.name == 'O'
})

var XWin = bp.Event('XWin')
var OWin = bp.Event('OWin')
var draw = bp.Event('Draw')
var MissWin = bp.Event('MissWin')
var gameOver = bp.EventSet('GameOver', function (e) {
  return e.equals(XWin) || e.equals(OWin) || e.equals(draw) || e.equals(MissWin)
})

// GameRules:
function addSquareBThreads(row, col) {
  bp.registerBThread('RandomXPlayer(' + row + ',' + col + ')', function () {
    bp.sync({ request: [X(row, col)] })
  })
  bp.registerBThread('SquareTaken(' + row + ',' + col + ')', function () {
    while (true) {
      bp.sync({ waitFor: [X(row, col), O(row, col)] })
      bp.sync({ block: [X(row, col), O(row, col)] })
    }
  })
}

for (var r = 0; r < 3; r++) {
  for (var c = 0; c < 3; c++) {
    addSquareBThreads(r, c)
  }
}
bp.registerBThread('EnforceTurns', function () {
  while (true) {
    bp.sync({ waitFor: Xmove, block: Omove })
    bp.sync({ waitFor: Omove, block: Xmove })
  }
})

// Represents when the game ends
bp.registerBThread('EndOfGame', function () {
  bp.sync({ waitFor: gameOver })
  if (typeof use_accepting_states !== 'undefined' && use_accepting_states != null) {
    AcceptingState.Stopping() // or AcceptingState.Continuing()
  }
  bp.sync({ block: bp.all })
})

// Represents when it is a draw
bp.registerBThread('DetectDraw', function () {
  for (var i = 0; i < 9; i++) {
    bp.sync({ waitFor: move })
  }
  bp.sync({ request: draw }, 90)
})

function addLinePermutationBthreads(l) {

  // Represents when X wins
  bp.registerBThread('DetectXWin(<' + l[0].x + ',' + l[0].y + '>,' + '<' + l[1].x + ',' + l[1].y + '>,' + '<' + l[2].x + ',' + l[2].y + '>)', function () {
    while (true) {
      bp.sync({ waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)] })
      bp.sync({ waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)] })
      bp.sync({ waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)] })
      bp.sync({ request: XWin }, 100)
    }
  })

  // Represents when O wins
  bp.registerBThread('DetectOWin(<' + l[0].x + ',' + l[0].y + '>,' + '<' + l[1].x + ',' + l[1].y + '>,' + '<' + l[2].x + ',' + l[2].y + '>)', function () {
    while (true) {
      bp.sync({ waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)] })
      bp.sync({ waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)] })
      bp.sync({ waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)] })
      bp.sync({ request: OWin }, 100)
    }
  })

  bp.registerBThread('O doesnt miss win(<' + l[0].x + ',' + l[0].y + '>,' + '<' + l[1].x + ',' + l[1].y + '>,' + '<' + l[2].x + ',' + l[2].y + '>)', function () {
    // const cells = getLineCells(l)
    // const cellsIds = cells.map(c => c.id)
    const xEevents = [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)]
    bp.sync({ waitFor: O(l[0].x, l[0].y), interrupt: xEevents })
    bp.sync({ waitFor: O(l[1].x, l[1].y), interrupt: xEevents })
    bp.sync({ waitFor: Xmove, interrupt: xEevents })
    bp.sync({ waitFor: Omove, interrupt: [O(l[2].x, l[2].y), X(l[2].x, l[2].y)] })
    let e = bp.sync({ waitFor: bp.all }).name
    // bp.log.info(e)
    // bp.log.info(cells)
    if (e != 'OWin') {
      bp.sync({ request: MissWin })
    }
  })

  // Player O strategy to add a the third O to win
  //LINE_CODE
}

// Player O strategy:

var lines = [[{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
  [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
  [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
  [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }]]

lines.forEach(function (l) {
  addLinePermutationBthreads(l)
})

