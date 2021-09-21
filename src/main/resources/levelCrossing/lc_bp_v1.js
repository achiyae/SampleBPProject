importPackage(Packages.il.ac.bgu.cs.bp.samplebpproject.levelCrossing)
if(typeof n === typeof undefined) {
  n = 1
}
bp.log.info("n=" + n)
// const x = [Approaching(0), Entering(0), Leaving(0),
//     Approaching(1), Entering(1), Leaving(1),
//     Approaching(2), Entering(2), Leaving(2),
//     Approaching(3), Entering(3), Leaving(3), 
//     Raise(), Lower(), ClosingRequest(), OpeningRequest(), KeepDown()];

for (var i = 0; i < n; i++) {
  (function (i) {
    bp.registerBThread('Railway ' + i + ' Sensors', function () {
      while (true) {
        bp.sync({ request: Approaching(i) })
        bp.sync({ request: Entering(i) })
        bp.sync({ request: Leaving(i) })
      }
    })

    bp.registerBThread('Barrier cannot be raised when there is a train in railway ' + i, function () {
      while (true) {
        bp.sync({ waitFor: Approaching(i) })
        bp.sync({ waitFor: Leaving(i), block: Raise() })//
      }
    })

    bp.registerBThread('Trains cannot enter railway ' + i + ' when the barier is down', function () {
      while (true) {
        bp.sync({ waitFor: Lower(), block: Entering(i) })
        bp.sync({ waitFor: Raise() })
      }
    })

  })(i)
}

bp.registerBThread('Lower the barrier when a train is approaching and then raise it as soon as possible', function () {
  while (true) {
    bp.sync({ waitFor: Approaching() })
    bp.sync({ request: Lower() })
    bp.sync({ request: Raise() })
  }
})

bp.registerBThread('mark state as accepting', function () {
  while (true) {
    if (use_accepting_states) {
      AcceptingState.Continuing()
      // AcceptingState.Stopping()
    }
    bp.sync({ waitFor: bp.all })
  }
})