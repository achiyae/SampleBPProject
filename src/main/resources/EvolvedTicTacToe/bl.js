function Move(row, col, type) {
  return bp.Event(type, {row: row, col: col});
}

function X(row, col) {
  return Move(row, col, "X");
}

function O(row, col) {
  return Move(row, col, "O");
}

var move = bp.EventSet("Move events", function (e) {
  //return e instanceof Move;
  return e.name == 'X' || e.name == "O";
});

var Xmove = bp.EventSet("X events", function (e) {
  //return e instanceof Move;
  return e.name == "X"
});

var Omove = bp.EventSet("O events", function (e) {
  //return e instanceof Move;
  return e.name == "O"
});

var XWin = bp.Event("XWin");
var OWin = bp.Event("OWin");
var draw = bp.Event("Draw");
var gameOver = bp.EventSet("GameOver", function (e) {
  return e.equals(XWin) || e.equals(OWin) || e.equals(draw);
});

// GameRules:
function addSquareBThreads(row, col) {
  bp.registerBThread("RandomXPlayer(" + row + "," + col + ")", function () {
    bp.sync({request: [X(row, col)]});
  });
  bp.registerBThread("SquareTaken(" + row + "," + col + ")", function () {
    while (true) {
      bp.sync({waitFor: [X(row, col), O(row, col)]});
      bp.sync({block: [X(row, col), O(row, col)]});
    }
  });
}

for (var r = 0; r < 3; r++) {
  for (var c = 0; c < 3; c++) {
    addSquareBThreads(r, c);
  }
}
bp.registerBThread("EnforceTurns", function () {
  while (true) {
    bp.sync({waitFor: Omove, block: Xmove});
    bp.sync({waitFor: Xmove, block: Omove});
  }
});

// Represents when the game ends
bp.registerBThread("EndOfGame", function () {
  bp.sync({waitFor: gameOver})
  bp.sync({block: bp.all})
});

// Represents when it is a draw
bp.registerBThread("DetectDraw", function () {
  for (var i = 0; i < 9; i++) {
    bp.sync({waitFor: move})
  }
  bp.sync({request: draw}, 90);
});

function addLinePermutationBthreads(l) {

  // Represents when X wins
  bp.registerBThread("DetectXWin(<" + l[0].x + "," + l[0].y + ">," + "<" + l[1].x + "," + l[1].y + ">," + "<" + l[2].x + "," + l[2].y + ">)", function () {
    while (true) {
      bp.sync({waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)]});
      bp.sync({waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)]});
      bp.sync({waitFor: [X(l[0].x, l[0].y), X(l[1].x, l[1].y), X(l[2].x, l[2].y)]});
      bp.sync({ request: XWin }, 100);
    }
  });

  // Represents when O wins
  bp.registerBThread("DetectOWin(<" + l[0].x + "," + l[0].y + ">," + "<" + l[1].x + "," + l[1].y + ">," + "<" + l[2].x + "," + l[2].y + ">)", function () {
    while (true) {
      bp.sync({waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)]});
      bp.sync({waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)]});
      bp.sync({waitFor: [O(l[0].x, l[0].y), O(l[1].x, l[1].y), O(l[2].x, l[2].y)]});
      bp.sync({ request: OWin }, 100);
    }
  });

  // Player O strategy to add a the third O to win
  //LINE_CODE
}

// Player O strategy:

var lines = [[{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
  [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}],
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
  [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
  [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
  [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
  [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}]];

lines.forEach(function (l) {
  addLinePermutationBthreads(l);
});


var forks22 = [[{x: 1, y: 2}, {x: 2, y: 0}], [{x: 2, y: 1}, {x: 0, y: 2}], [{x: 1, y: 2}, {x: 2, y: 1}]];
var forks02 = [[{x: 1, y: 2}, {x: 0, y: 0}], [{x: 0, y: 1}, {x: 2, y: 2}], [{x: 1, y: 2}, {x: 0, y: 1}]];
var forks20 = [[{x: 1, y: 0}, {x: 2, y: 2}], [{x: 2, y: 1}, {x: 0, y: 0}], [{x: 2, y: 1}, {x: 1, y: 0}]];
var forks00 = [[{x: 0, y: 1}, {x: 2, y: 0}], [{x: 1, y: 0}, {x: 0, y: 2}], [{x: 0, y: 1}, {x: 1, y: 0}]];

var forksdiag = [[{x: 0, y: 2}, {x: 2, y: 0}],[ { x:0, y:0 },{ x:2, y:2 }] // <--- Intentional BUG
];

var permsforks = [[0, 1], [1, 0]];


// Preference to put O on the center
// O_PLAYER_CODE

// Assertions

function addAssertions(f, p) {

  bp.registerBThread("AssertWin(<" + f[p[0]].x + "," + f[p[0]].y + ">," + "<" + f[p[1]].x + "," + f[p[1]].y + ">," + "<" + f[p[2]].x + "," + f[p[2]].y + ">)", function () {

    //let ev1 = bp.sync({waitFor: [O(f[p[0]].x, f[p[0]].y), X(f[p[2]].x, f[p[2]].y)]})
    if(bp.sync({waitFor: [O(f[p[0]].x, f[p[0]].y), X(f[p[2]].x, f[p[2]].y)]}).name.equals('X')) {
      return;
    }
    //let ev2 = bp.sync({waitFor: [O(f[p[1]].x, f[p[1]].y), X(f[p[2]].x, f[p[2]].y)]});
    if(bp.sync({waitFor: [O(f[p[1]].x, f[p[1]].y), X(f[p[2]].x, f[p[2]].y)]}).name.equals('X')){
      return;
    }
    //if (ev2.name == 'X') {
    //  return;
    //}
    //let ev = bp.sync({waitFor: [Omove, X(f[p[2]].x, f[p[2]].y)]});
    while(true) {
      if (bp.sync({waitFor: [Omove, X(f[p[2]].x, f[p[2]].y)]}).name.equals('X')) {
        //x blocked the win - no violation
        return;
      } else {
        if (bp.sync({waitFor: [OWin, Xmove]}).name.equals('X')) {
          //x moved again, was not win
          bp.sync({request: bp.Event("WIN_VIOLATION")}, 110);
        } else {
          //was a win
          return;
        }
      }
    }
    //bp.ASSERT(ev.name.startsWith("X(") || ev.name.startsWith("O(" + f[p[2]].x + "," + f[p[2]].y + ")"), "WIN_VIOLATION");
    /*if(!(ev.name.startsWith("X(") || ev.name.startsWith("O(" + f[p[2]].x + "," + f[p[2]].y + ")"))){
      bp.sync({request: bp.Event("WIN_VIOLATION")}, 110);
    }*/
  });

  bp.registerBThread("AssertBlock(<" + f[p[0]].x + "," + f[p[0]].y + ">," + "<" + f[p[1]].x + "," + f[p[1]].y + ">," + "<" + f[p[2]].x + "," + f[p[2]].y + ">)", function () {
    //let ev1 = bp.sync({waitFor: [X(f[p[0]].x, f[p[0]].y), O(f[p[2]].x, f[p[2]].y)]});
    if (bp.sync({waitFor: [X(f[p[0]].x, f[p[0]].y), O(f[p[2]].x, f[p[2]].y)]}).name.equals("O"))
      return;

    //let ev2 = bp.sync({waitFor: [X(f[p[1]].x, f[p[1]].y), O(f[p[2]].x, f[p[2]].y)]});
    if (bp.sync({waitFor: [X(f[p[1]].x, f[p[1]].y), O(f[p[2]].x, f[p[2]].y)]}).name.equals("O"))
      return;

    // let ev = bp.sync({waitFor: [Omove]});
    // let evNext = bp.sync({waitFor: [Xmove, OWin]})
    // //bp.ASSERT(!evNext.name.startsWith("X(") || ev.name.startsWith("O(" + f[p[2]].x + "," + f[p[2]].y + ")"), "BLOCK_VIOLATION");
    // if(!(!evNext.name.startsWith("X(") || ev.name.startsWith("O(" + f[p[2]].x + "," + f[p[2]].y + ")"))){
    //   bp.sync({request: bp.Event("BLOCK_VIOLATION")}, 110);
    // }


    while (true) {
      if (bp.sync({waitFor: [O(f[p[2]].x, f[p[2]].y), Xmove]}).name.equals('X')) {
        //O was not placed to block
        bp.sync({request: bp.Event("BLOCK_VIOLATION")}, 110);
      } else {
        //blocked win
        bp.sync({request: bp.Event("BLOCK")}, 110);
        return;
      }
    }
  });
}


function addForkAssertions(f, solution) {

  // Player X strategy to prevent the Fork22 of player O
  bp.registerBThread("ForkAssertion(<" + f[0].x + "," + f[0].y + ">," + "<" + f[1].x + "," + f[1].y + ">)", function() {
    while (true) {
      solution.push(X(f[0].x, f[0].y));
      solution.push(X(f[1].x, f[1].y));
      if(bp.sync({ waitFor:solution }).name.equals("O"))
        return;

      if(bp.sync({ waitFor:solution }).name.equals("O"))
        return;

      solution.push(Xmove);
      solution.push(OWin);

      let ev = bp.sync({waitFor: solution});

      if (ev.name.equals("OWin"))
        return;
      if (ev.name.equals("X"))
        bp.sync({request: bp.Event("FORK_VIOLATION")}, 110);
      else
        bp.sync({request: bp.Event("FORK")}, 110);

      // if (solution.includes(ev))
      //   bp.sync({request: bp.Event("FORK")}, 110);
      // if (ev.name.equals("OWin"))
      //   return;
      // else
      //   bp.sync({request: bp.Event("FORK_VIOLATION")}, 110);
    }
  });
}


var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2],
  [1, 2, 0], [2, 0, 1], [2, 1, 0]];

lines.forEach(function (l) {
  perms.forEach(function (p) {
    addAssertions(l, p);
  });
});

forks22.forEach(function(f) {
  addForkAssertions(f, [ O(2, 2), O(0,2), O(2,0) ]);
});
forks02.forEach(function(f) {
  addForkAssertions(f, [ O(0, 2), O(0,0), O(2,2) ]);
});
forks20.forEach(function(f) {
  addForkAssertions(f, [ O(2, 0), O(0,0), O(2,2) ]);
});
forks00.forEach(function(f) {
  addForkAssertions(f, [ O(0, 0), O(0,2), O(2,0) ]);
});
forksdiag.forEach(function(f) {
  addForkAssertions(f, [ O(0, 1), O(1, 0), O(1, 2), O(2, 1) ]);
});