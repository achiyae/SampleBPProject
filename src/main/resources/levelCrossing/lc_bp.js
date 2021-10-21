importPackage(Packages.il.ac.bgu.cs.bp.samplebpproject.levelCrossing)
if(typeof n === typeof undefined) {
  n = 1
}
bp.log.info("Number of railways = " + n)

for (var i = 0; i < n; i++) {
  (function (i) {
    bp.registerBThread('R1: Railway ' + i + ' Sensors', function () {
      while (true) {
        bp.sync({ request: Approaching(i) })
        bp.sync({ request: Entering(i) })
        bp.sync({ request: Leaving(i) })
      }
    })

    bp.registerBThread('R3: train ' + i + 'may not enter while barriers are up', function () {
      while (true) {
        bp.sync({ waitFor: Lower(), block: Entering(i) })
        bp.sync({ waitFor: Raise() })
      }
    })

    bp.registerBThread('R4: Do not raise barriers while train ' + i + ' is in the intersection zone', function () {
      while (true) {
        bp.sync({ waitFor: Approaching(i) })
        bp.sync({ waitFor: Leaving(i), block: Raise() })
      }
    })
  })(i)
}

bp.registerBThread('R2: Barriers Dynamics', function () {
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