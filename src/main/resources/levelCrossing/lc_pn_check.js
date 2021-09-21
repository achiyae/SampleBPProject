importPackage(Packages.il.ac.bgu.cs.bp.samplebpproject.levelCrossing)
if(typeof n === typeof undefined) {
  n = 1
}
bp.log.info("n=" + n)
// const x = [Approaching(0), Entering(0), Leaving(0), 
//             Approaching(1), Entering(1), Leaving(1),
//             Approaching(2), Entering(2), Leaving(2),
//             Approaching(3), Entering(3), Leaving(3), 
//             Raise(), Lower(), ClosingRequest(), OpeningRequest(), KeepDown()];

for (var i = 0; i < n; i++) {
  (function (i) {
    bp.registerBThread('p_' + i + '_1', function () {
      while (true) {
        bp.sync({ waitFor: Approaching(i) })
        bp.sync({ waitFor: Leaving(i), block: Approaching(i) })
      }
    })
    bp.registerBThread('p_' + i + '_2', function () {
      while (true) {
        bp.sync({ waitFor: Approaching(i), block: Entering(i) })
        bp.sync({ waitFor: Entering(i) })
      }
    })
    bp.registerBThread('p_' + i + '_3', function () {
      while (true) {
        bp.sync({ waitFor: Entering(i), block: Leaving(i) })
        bp.sync({ waitFor: Leaving(i) })
      }
    })
    bp.registerBThread('phelper_' + i, function () {
      while (true) {
        bp.sync({ request: [Approaching(i), Entering(i), Leaving(i)] })
      }
    })
  })(i)
}

bp.registerBThread('p_1', function () {
  var p_1_x = 0
  while (true) {
    if (p_1_x < 1) {
      bp.sync({ waitFor: Approaching(), block: ClosingRequest() })
      p_1_x += 1
    } else {
      if (bp.sync({ waitFor: [ClosingRequest(), Approaching()] }).name.startsWith('ClosingRequest')) {
        p_1_x -= 1
      } else {
        p_1_x += 1
      }
    }
  }
})

bp.registerBThread('p_2', function () {
  var p_2_x = n
  while (true) {
    if (p_2_x < 1) {
      bp.sync({ waitFor: OpeningRequest(), block: ClosingRequest() })
      p_2_x += 1
    } else {
      if (bp.sync({ waitFor: [ClosingRequest(), OpeningRequest()] }).name.startsWith('ClosingRequest')) {
        p_2_x -= 1
      } else {
        p_2_x += 1
      }
    }
  }
})

bp.registerBThread('p_3', function () {
  var p_3_x = 0
  while (true) {
    if (p_3_x < 1) {
      bp.sync({ waitFor: ClosingRequest(), block: OpeningRequest() })
      p_3_x += 1
    } else {
      if (bp.sync({ waitFor: [ClosingRequest(), OpeningRequest()] }).name.startsWith('OpeningRequest')) {
        p_3_x -= 1
      } else {
        p_3_x += 1
      }
    }
  }
})

bp.registerBThread('p_4', function () {
  var p_4_x = 0
  while (true) {
    if (p_4_x < 1) {
      bp.sync({ waitFor: Leaving(), block: OpeningRequest() })
      p_4_x += 1
    } else {
      if (bp.sync({ waitFor: [OpeningRequest(), Leaving()] }).name.startsWith('OpeningRequest')) {
        p_4_x -= 1
      } else {
        p_4_x += 1
      }
    }
  }
})

bp.registerBThread('p_5', function () {
  var p_5_x = 0
  while (true) {
    if (p_5_x < 1) {
      bp.sync({ waitFor: ClosingRequest(), block: [Lower(), KeepDown()] })
      p_5_x += 1
    } else {
      if (bp.sync({ waitFor: [ClosingRequest(), Lower(), KeepDown()] }).name.startsWith('ClosingRequest')) {
        p_5_x += 1
      } else {
        p_5_x -= 1
      }
    }
  }
})

bp.registerBThread('p_6', function () {
  var p_6_x = n
  var event = ''
  while (true) {
    if (p_6_x >= n) {
      event = bp.sync({ waitFor: [ClosingRequest(), OpeningRequest(), Raise()] }).name
      if (event.startsWith('OpeningRequest')) {
        p_6_x += 1
      } else {
        if (event.startsWith('ClosingRequest')) {
          p_6_x -= 1
        }
      }
      event = ''
    } else {
      if (p_6_x >= 1) {
        if (bp.sync({
          waitFor: [ClosingRequest(), OpeningRequest()],
          block: Raise()
        }).name.startsWith('OpeningRequest')) {
          p_6_x += 1
        } else {
          p_6_x -= 1
        }
      } else {
        bp.sync({ waitFor: OpeningRequest(), block: [Raise(), ClosingRequest()] })
        p_6_x += 1
      }
    }
  }
})

bp.registerBThread('p_7', function () {
  var p_7_x = 1
  while (true) {
    if (p_7_x < 1) {
      bp.sync({ waitFor: Raise(), block: Lower() })
      p_7_x += 1
    } else {
      if (bp.sync({ waitFor: [Raise(), Lower()] }).name.startsWith('Raise')) {
        p_7_x += 1
      } else {
        p_7_x -= 1
      }
    }
  }
})

bp.registerBThread('p_8', function () {
  var p_8_x = 0
  var event = ''
  while (true) {
    if (p_8_x < 1) {
      if (bp.sync({ waitFor: Lower(), block: [Raise(), KeepDown()] }).name.startsWith('Lower')) {
        p_8_x += 1
      } else {
        p_8_x -= 1
      }
    } else {
      event = bp.sync({ waitFor: [Lower(), KeepDown(), Raise()] }).name
      if (event.startsWith('Lower')) {
        p_8_x += 1
      } else {
        if (event.startsWith('Raise')) {
          p_8_x -= 1
        }
      }
      event = ''
    }
  }
})

bp.registerBThread('p_9', function () {
  var p_9_x = 0
  var event = ''
  while (true) {
    if (p_9_x < 1) {
      bp.sync({ waitFor: [Lower(), KeepDown()], block: [Entering(), Leaving()] })
      //bp.sync({waitFor: [Lower(), KeepDown()], block:[Leaving()]});
      //bp.sync({waitFor: [Lower(), KeepDown()]});
      p_9_x += 1
    } else {
      event = bp.sync({ waitFor: [Lower(), KeepDown(), Entering(), Leaving()] }).name
      if (event.startsWith('Lower') || event.startsWith('KeepDown')) {
        p_9_x += 1
      }
      if (event.startsWith('Leaving')) {
        p_9_x -= 1
      }
      event = ''
    }
  }
})

bp.registerBThread('phelper', function () {
  while (true) {
    bp.sync({
      request: [ClosingRequest(),
        OpeningRequest(),
        Lower(),
        Raise(),
        KeepDown()]
    })
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