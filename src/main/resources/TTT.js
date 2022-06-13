bp.log.info('Tic-Tac-Toe - Let the game begin!')

const AnyX = bp.EventSet('AnyX', function (e) {
  return e.name.startsWith('X')
})
const AnyO = bp.EventSet('AnyO', function (e) {
  return e.name.startsWith('O')
})

const move = bp.EventSet('Move events', function (e) {
  return e.name.startsWith('O') || e.name.startsWith('X')
})

function Click(row, col) {
  return bp.Event('Click(' + row + ',' + col + ')')
}

function X(row, col) {
  return bp.Event('X(' + row + ',' + col + ')')
}

function O(row, col) {
  return bp.Event('O(' + row + ',' + col + ')')
}

StaticEvents = {
  'OWin': bp.Event('OWin'),
  'XWin': bp.Event('XWin'),
  'draw': bp.Event('draw')
}

// GameRules:

// This BThreads are on each square of the grid
function addSquareBThreads(row, col) {

  // Detects mouse click
  bp.registerBThread('ClickHandler(' + row + ',' + col + ')', function () {
    bp.sync({ waitFor: Click(row, col) })
    bp.sync({ request: [X(row, col)] })
  })

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
  bp.sync({ block: move })
})


// Represents when it is a draw
bp.registerBThread('DetectDraw', function () {
  for (var r = 0; r < 9; r++) {
    bp.sync({ waitFor: move })
  }

  bp.sync({ request: [StaticEvents.draw] }, 90)
})

function addLineBThreads(l) {

  bp.registerBThread('DetectXWin', function () {
    const line = l.map(c => X(c.x, c.y))
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line })

    bp.sync({ request: [StaticEvents.XWin] }, 100)
  })

  bp.registerBThread('DetectOWin', function () {
    const line = l.map(c => O(c.x, c.y))
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line })

    bp.sync({ request: [StaticEvents.OWin] }, 100)
  })


  // Player O strategy to add a the third O to win
  bp.registerBThread('AddThirdO', function () {
    const line = l.map(c => O(c.x, c.y))
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line })
    bp.sync({ waitFor: line }, 50)
  })

  bp.registerBThread('PreventThirdX', function () {
    const lineX = l.map(c => X(c.x, c.y))
    const lineO = l.map(c => O(c.x, c.y))
    bp.sync({ waitFor: lineX })
    bp.sync({ waitFor: lineX })
    bp.sync({ request: lineO }, 40)
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
  addLineBThreads(l)
})

function addFork22PermutationBthreads(f) {
  // Player O strategy to prevent the Fork22 of player X
  bp.registerBThread('PreventFork22X', function () {
    const fork = f.map(c => X(c.x, c.y))
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(2, 2), O(0, 2), O(2, 0)] }, 30)
  })
}

function addFork02PermutationBthreads(f) {
  // Player O strategy to prevent the Fork02 of player X
  bp.registerBThread('PreventFork02X', function () {
    const fork = f.map(c => X(c.x, c.y))
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(0, 2), O(0, 0), O(2, 2)] }, 30)
  })
}

function addFork20PermutationBthreads(f) {
  // Player O strategy to prevent the Fork20 of player X
  bp.registerBThread('PreventFork20X', function () {
      const fork = f.map(c => X(c.x, c.y))
      bp.sync({ waitFor: fork })
      bp.sync({ waitFor: fork })

      bp.sync({ request: [O(2, 0), O(0, 0), O(2, 2)] }, 30)
    }
  )
}

function addFork00PermutationBthreads(f) {
  // Player O strategy to prevent the Fork00 of player X
  bp.registerBThread('PreventFork00X', function () {
    const fork = f.map(c => X(c.x, c.y))
    bp.sync({ waitFor: fork })
    bp.sync({ waitFor: fork })
    bp.sync({ request: [O(0, 0), O(0, 2), O(2, 0)] }, 30)
  })
}

function addForkdiagPermutationBthreads(f) {
  // Player O strategy to prevent the Forkdiagonal of player X
  bp.registerBThread('PreventForkdiagX', function () {
    const fork = f.map(c => X(c.x, c.y))
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
  addFork22PermutationBthreads(f)
})

forks02.forEach(function (f) {
  addFork02PermutationBthreads(f)
})

forks20.forEach(function (f) {
  addFork20PermutationBthreads(f)
})

forks00.forEach(function (f) {
  addFork00PermutationBthreads(f)
})

forksdiag.forEach(function (f) {
  addForkdiagPermutationBthreads(f)
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
      cells.push(Click(i, j))
    }
  }
  while (true) {
    bp.sync({ request: cells })
  }
})
