/* global bp */
function bthread(name, func) {
  bp.registerBThread(name, func)
}

function sync(stmt, data) {
  if (data)
    return bp.sync(stmt, data)
  return bp.sync(stmt)
}

function hot(isHot) {
  return bp.hot(isHot)
}

// ############ Basic behaviors ##############

const PHIL_COUNT = 5

const Take = (i, side) => bp.Event('Take', {id: i, side: side})
const Put = (i, side) => bp.Event('Put', {id: i, side: side})
const PhilosopherTakeEvent = i => [Take(i, 'R'), Take(i, 'L')]
const PhilosopherPutEvent = i => [Put(i, 'R'), Put(i, 'L')]
const AnyPhilosopherAction = i => PhilosopherTakeEvent(i).concat(PhilosopherPutEvent(i))
const StickTaken = i => [Take(i, "R"), Take((i % PHIL_COUNT) + 1, "L")]
const StickPut = i => [Put(i, "R"), Put((i % PHIL_COUNT) + 1, "L")]

for (let c = 1; c <= PHIL_COUNT; c++) {
  let i = c
  bthread('Fork ' + i + ' behavior', function () {
    while (true) {
      sync({waitFor: StickTaken(i), block: StickPut(i)})
      sync({waitFor: StickPut(i), block: StickTaken(i)})
    }
  })

  bthread('Philosopher ' + i + ' behavior', function () {
    while (true) {
      sync({request: [Take(i, 'R'), Take(i, 'L')]})
      sync({request: [Take(i, 'R'), Take(i, 'L')]})
      sync({request: [Put(i, 'R'), Put(i, 'L')]})
      sync({request: [Put(i, 'R'), Put(i, 'L')]})
    }
  })
}


// ############  Liveness requirements  ##############
for (let c = 1; c <= PHIL_COUNT; c++) {
  let i = c

  // A taken stick will eventually be released
  bthread("[](take -> <>put)", function () {
    while (true) {
      sync({waitFor: StickTaken(i)})
      hot(true).sync({waitFor: StickPut(i)})
    }
  })

  // A hungry philosopher will eventually eat
  bthread("NoStarvation", function () {
    while (true) {
      hot(true).sync({waitFor: [Take(i, 'R'), Take(i, 'L')]})
      hot(true).sync({waitFor: [Take(i, 'R'), Take(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
    }
  })
}


// ############  SOLUTION 1 - Semaphore  ##############
const TakeSemaphore = i => bp.Event('TakeSemaphore', i)
const ReleaseSemaphore = i => bp.Event('ReleaseSemaphore', i)
const AnyTakeSemaphore = bp.EventSet('AnyTakeSemaphore', function (e) {
  return e.name == 'TakeSemaphore'
})
const AnyReleaseSemaphore = bp.EventSet('AnyReleaseSemaphore', function (e) {
  return e.name == 'ReleaseSemaphore'
})

bthread('Semaphore', function () {
  while (true) {
    sync({waitFor: AnyTakeSemaphore})
    sync({waitFor: AnyReleaseSemaphore, block: AnyTakeSemaphore})
  }
})

for (let c = 1; c <= PHIL_COUNT; c++) {
  let i = c
  /*bthread('Take semaphore ' + i, function () {
    while (true) {
      sync({request: TakeSemaphore(i), block: AnyPhilosopherAction(i)})
      sync({waitFor: AnyPhilosopherAction(i)})
      sync({waitFor: AnyPhilosopherAction(i)})
      sync({request: ReleaseSemaphore(i), block: AnyPhilosopherAction(i)})
      // sync({waitFor: AnyPhilosopherAction(i)})
      // sync({waitFor: AnyPhilosopherAction(i)})
    }
  })*/
  bthread('Take semaphore ' + i, function () {
    while (true) {
      sync({request: TakeSemaphore(i), block: [Take(i, 'R'),Take(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
      sync({request: ReleaseSemaphore(i), block: [Take(i, 'R'),Take(i, 'L')]})
    }
  })
}

