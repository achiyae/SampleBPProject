function Click(row,col) {
  return bp.Event("Click("+row+","+col+")");
}

function X(row,col) {
  return bp.Event("X("+row+","+col+")");
}

function O(row,col) {
  return bp.Event("O("+row+","+col+")");
}

StaticEvents={
  'OWin':bp.Event("OWin"),
  'XWin':bp.Event("XWin"),
  'draw':bp.Event("draw")
};

// GameRules:

// This BThreads are on each square of the grid
function addSquareBThreads(row, col) {

  // Detects mouse click
  bp.registerBThread("ClickHandler(" + row + "," + col + ")", function() {
    while (true) {
      bp.sync({ waitFor: Click(row, col)  });
      bp.sync({ request:[ X(row, col) ] });
    }
  });

  // Blocks further marking of a square already marked by X or O.
  bp.registerBThread("SquareTaken(" + row + "," + col + ")", function() {
    while (true) {
      bp.sync({ waitFor:[ X(row, col), O(row, col) ] });
      bp.sync({ block:[ X(row, col), O(row, col) ] });
    }
  });
}

for (var r = 0; r < 3; r++) {
  for (var c = 0; c < 3; c++) {
    addSquareBThreads(r, c);
  }
}

// Represents Enforce Turns
bp.registerBThread("EnforceTurns", function() {
  while (true) {
    bp.sync({ waitFor:[ X(0, 0), X(0, 1), X(0, 2),
        X(1, 0), X(1, 1), X(1, 2),
        X(2, 0), X(2, 1), X(2, 2) ],
      block:[ O(0, 0), O(0, 1), O(0, 2),
        O(1, 0), O(1, 1), O(1, 2),
        O(2, 0), O(2, 1), O(2, 2) ] });
    bp.sync({ waitFor:[ O(0, 0), O(0, 1), O(0, 2), O(1, 0), O(1, 1), O(1, 2), O(2, 0), O(2, 1), O(2, 2) ],
      block:[ X(0, 0), X(0, 1), X(0, 2), X(1, 0), X(1, 1), X(1, 2), X(2, 0), X(2, 1), X(2, 2) ] });
  }
});

// Represents when the game ends
bp.registerBThread("EndOfGame", function() {
  bp.sync({ waitFor:[ StaticEvents.OWin, StaticEvents.XWin, StaticEvents.draw ] });
  bp.sync({ block:[ X(0, 0), X(0, 1), X(0, 2),
      X(1, 0), X(1, 1), X(1, 2),
      X(2, 0), X(2, 1), X(2, 2),
      O(0, 0), O(0, 1), O(0, 2),
      O(1, 0), O(1, 1), O(1, 2),
      O(2, 0), O(2, 1), O(2, 2) ] });
});

var move = bp.EventSet("Move events", function(e) {
  return e.name.startsWith("O") || e.name.startsWith("X");
});

// Represents when it is a draw
bp.registerBThread("DetectDraw", function() {
  // For debug
  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });

  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });

  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });
  bp.sync({ waitFor:[ move ] });
  /*
   * for (var i=0; i< 9; i++) { bp.sync({ waitFor:[ move ] }); }
   */

  bp.sync({ request:[ StaticEvents.draw ] }, 90);
});

function addLinePermutationBthreads(l, p) {

  // Represents when X wins
  bp.registerBThread("DetectXWin(<" + l[p[0]].x + "," + l[p[0]].y + ">," + "<" + l[p[1]].x + "," + l[p[1]].y + ">," + "<" + l[p[2]].x + "," + l[p[2]].y + ">)", function () {
    while (true) {
      bp.sync({ waitFor: [X(l[p[0]].x, l[p[0]].y)] });

      bp.sync({ waitFor: [X(l[p[1]].x, l[p[1]].y)] });

      bp.sync({ waitFor: [X(l[p[2]].x, l[p[2]].y)] });

      bp.sync({ request: [StaticEvents.XWin] }, 100);

    }
  });

  // Represents when O wins
  bp.registerBThread("DetectOWin(<" + l[p[0]].x + "," + l[p[0]].y + ">," + "<" + l[p[1]].x + "," + l[p[1]].y + ">," + "<" + l[p[2]].x + "," + l[p[2]].y + ">)", function () {
    while (true) {
      bp.sync({ waitFor: [O(l[p[0]].x, l[p[0]].y)] });

      bp.sync({ waitFor: [O(l[p[1]].x, l[p[1]].y)] });

      bp.sync({ waitFor: [O(l[p[2]].x, l[p[2]].y)] });

      bp.sync({ request: [StaticEvents.OWin] }, 100);

    }
  });
}

var lines = [ [ { x:0, y:0 }, { x:0, y:1 }, { x:0, y:2 } ],
  [ { x:1, y:0 }, { x:1, y:1 }, { x:1, y:2 } ],
  [ { x:2, y:0 }, { x:2, y:1 }, { x:2, y:2 } ],
  [ { x:0, y:0 }, { x:1, y:0 }, { x:2, y:0 } ],
  [ { x:0, y:1 }, { x:1, y:1 }, { x:2, y:1 } ],
  [ { x:0, y:2 }, { x:1, y:2 }, { x:2, y:2 } ],
  [ { x:0, y:0 }, { x:1, y:1 }, { x:2, y:2 } ],
  [ { x:0, y:2 }, { x:1, y:1 }, { x:2, y:0 } ] ];
var perms = [ [ 0, 1, 2 ], [ 0, 2, 1 ], [ 1, 0, 2 ],
  [ 1, 2, 0 ], [ 2, 0, 1 ], [ 2, 1, 0 ] ];

lines.forEach(function(l) {
  perms.forEach(function(p) {
    addLinePermutationBthreads(l, p);
  });
});
