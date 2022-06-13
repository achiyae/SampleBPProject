bp.log.info('Tic-Tac-Toe - Let the game begin!')

var AnyX = bp.EventSet('AnyX', function (e) {
  return e.name.startsWith('X(')
})
var AnyO = bp.EventSet('AnyO', function (e) {
  return e.name.startsWith('O(')
})

var move = bp.EventSet('Move events', function (e) {
  return e.name.startsWith('O(') || e.name.startsWith('X(')
})

function X(row, col) {
  return bp.Event('X(' + row + ',' + col + ')')
}

function O(row, col) {
  return bp.Event('O(' + row + ',' + col + ')')
}

StaticEvents = {
  'OWin': bp.Event('OWin'),
  'XWin': bp.Event('XWin'),
  'draw': bp.Event('Draw')
}

// GameRules:

// This BThreads are on each square of the grid
function addSquareBThreads(row, col) {

  // Blocks further marking of a square already marked by X or O.
  bp.registerBThread('SquareTaken(' + row + ',' + col + ')', function () {
    bp.sync({ waitFor: [X(row, col), O(row, col)] })
    bp.sync({ block: [X(row, col), O(row, col)] })
  })
}

for (var r = 0; r < 3; r++) {
  for (var c = 0; c < 3; c++) {
    addSquareBThreads(r, c)
  }
}

// Represents Enforce Turns
bp.registerBThread('EnforceTurns', function () {
  while (true) {
    bp.sync({ waitFor: AnyX, block: AnyO })
    bp.sync({ waitFor: AnyO, block: AnyX })
  }
})

// Represents when the game ends
bp.registerBThread('EndOfGame', function () {
  bp.sync({ waitFor: [StaticEvents.OWin, StaticEvents.XWin, StaticEvents.draw] })
  if (typeof use_accepting_states !== 'undefined') {
    AcceptingState.Stopping() // or AcceptingState.Continuing()
  }
  bp.sync({ block: bp.all })
})


// Represents when it is a draw
bp.registerBThread('DetectDraw', function () {
  for (var r = 0; r < 9; r++) {
    bp.sync({ waitFor: move })
  }

  bp.sync({ request: [StaticEvents.draw] }, 90)
})

function addLineBThreads(xline, oline) {

  bp.registerBThread('DetectXWin', function () {
    bp.sync({ waitFor: xline })
    bp.sync({ waitFor: xline })
    bp.sync({ waitFor: xline })

    bp.sync({ request: [StaticEvents.XWin] }, 100)
  })

  bp.registerBThread('DetectOWin', function () {
    bp.sync({ waitFor: oline })
    bp.sync({ waitFor: oline })
    bp.sync({ waitFor: oline })

    bp.sync({ request: [StaticEvents.OWin] }, 100)
  })


  // Player O strategy to add a the third O to win
  bp.registerBThread('AddThirdO', function () {
    bp.sync({ waitFor: oline })
    bp.sync({ waitFor: oline })
    bp.sync({ request: oline }, 50)
  })

  bp.registerBThread('PreventThirdX', function () {
    bp.sync({ waitFor: xline })
    bp.sync({ waitFor: xline })
    bp.sync({ request: oline }, 40)
  })

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
  addLineBThreads(l.map(c => X(c.x, c.y)), l.map(c => O(c.x, c.y)))
})

function addFork22PermutationBthreads(fork) {
  // Player O strategy to prevent the Fork22 of player X
  bp.registerBThread('PreventFork22X', function () {
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(2, 2), O(0, 2), O(2, 0)] }, 30)
  })
}

function addFork02PermutationBthreads(fork) {
  // Player O strategy to prevent the Fork02 of player X
  bp.registerBThread('PreventFork02X', function () {
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(0, 2), O(0, 0), O(2, 2)] }, 30)
  })
}

function addFork20PermutationBthreads(fork) {
  bp.registerBThread('PreventFork20X', function () {
      bp.sync({ waitFor: fork })
      bp.sync({ waitFor: fork })

      bp.sync({ request: [O(2, 0), O(0, 0), O(2, 2)] }, 30)
    }
  )
}

function addFork00PermutationBthreads(fork) {
  bp.registerBThread('PreventFork00X', function () {
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(0, 0), O(0, 2), O(2, 0)] }, 30)
  })
}

function addForkdiagPermutationBthreads(fork) {
  bp.registerBThread('PreventForkdiagX', function () {
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(0, 1), O(1, 0), O(1, 2), O(2, 1)] }, 30)
  })
}

var forks22 = [[{ x: 1, y: 2 }, { x: 2, y: 0 }], [{ x: 2, y: 1 }, { x: 0, y: 2 }], [{ x: 1, y: 2 }, { x: 2, y: 1 }]]
var forks02 = [[{ x: 1, y: 2 }, { x: 0, y: 0 }], [{ x: 0, y: 1 }, { x: 2, y: 2 }], [{ x: 1, y: 2 }, { x: 0, y: 1 }]]
var forks20 = [[{ x: 1, y: 0 }, { x: 2, y: 2 }], [{ x: 2, y: 1 }, { x: 0, y: 0 }], [{ x: 2, y: 1 }, { x: 1, y: 0 }]]
var forks00 = [[{ x: 0, y: 1 }, { x: 2, y: 0 }], [{ x: 1, y: 0 }, { x: 0, y: 2 }], [{ x: 0, y: 1 }, { x: 1, y: 0 }]]

var forksdiag = [[{ x: 0, y: 2 }, { x: 2, y: 0 }], [{ x: 0, y: 0 }, { x: 2, y: 2 }]]

forks22.forEach(function (f) {
  addFork22PermutationBthreads(f.map(c => X(c.x, c.y)))
})

forks02.forEach(function (f) {
  addFork02PermutationBthreads(f.map(c => X(c.x, c.y)))
})

forks20.forEach(function (f) {
  addFork20PermutationBthreads(f.map(c => X(c.x, c.y)))
})

forks00.forEach(function (f) {
  addFork00PermutationBthreads(f.map(c => X(c.x, c.y)))
})

forksdiag.forEach(function (f) {
  addForkdiagPermutationBthreads(f.map(c => X(c.x, c.y)))
})

// Preference to put O on the center
bp.registerBThread('Center', function () {
  bp.sync({ request: [O(1, 1)] }, 35)
})

// Preference to put O on the corners
bp.registerBThread('Corners', function () {
  while (true) {
    bp.sync({ request: [O(0, 0), O(0, 2), O(2, 0), O(2, 2)] }, 20)

  }
})

// Preference to put O on the sides
bp.registerBThread('Sides', function () {
  while (true) {
    bp.sync({ request: [O(0, 1), O(1, 0), O(1, 2), O(2, 1)] }, 10)
  }
})

bp.registerBThread('Simulate X', function () {
  var cells = []
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      cells.push(X(i, j))
    }
  }

  while (true) {
    bp.sync({ request: cells })
  }
})
