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

const PHILOSOPHER_COUNT = 3

const Take = (i, side) => bp.Event('Take', {id: i, side: side})
const Put = (i, side) => bp.Event('Put', {id: i, side: side})
const AnyTake = i => [Take(i, "R"), Take((i % PHILOSOPHER_COUNT) + 1, "L")]
const AnyPut = i => [Put(i, "R"), Put((i % PHILOSOPHER_COUNT) + 1, "L")]

for (let c = 1; c <= PHILOSOPHER_COUNT; c++) {
  let i = c
  bthread('Fork ' + i + ' behavior', function () {
    while (true) {
      bp.sync({waitFor: AnyTake(i), block: AnyPut(i)})
      bp.sync({waitFor: AnyPut(i), block: AnyTake(i)})
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
for (let c = 1; c <= PHILOSOPHER_COUNT; c++) {
  let i = c

  // A taken fork will eventually be released
  bthread('[](take -> <>put)', function () {
    while (true) {
      sync({waitFor: AnyTake(i)})
      hot(true).sync({waitFor: AnyPut(i)})
    }
  })

  // A hungry philosopher will eventually eat
  bthread('NoStarvation', function () {
    while (true) {
      hot(true).sync({waitFor: Take(i, 'L')})
      sync({waitFor: Put(i, 'R')})
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

/*bthread('Semaphore', function () {
  while (true) {
    sync({waitFor: AnyTakeSemaphore})
    sync({waitFor: AnyReleaseSemaphore, block: AnyTakeSemaphore})
  }
})

for (let c = 1; c <= PHILOSOPHER_COUNT; c++) {
  let i = c
  bthread('Take semaphore ' + i, function () {
    while (true) {
      sync({request: TakeSemaphore(i), block: [Take(i, 'R'), Take(i, 'L')]})
      sync({waitFor: [Take(i, 'R'), Take(i, 'L')]})
      sync({waitFor: [Take(i, 'R'), Take(i, 'L')]})
      sync({request: ReleaseSemaphore(i), block: [Put(i, 'R'), Put(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
      sync({waitFor: [Put(i, 'R'), Put(i, 'L')]})
    }
  })
}*/

bp.registerBThread('mark state as accepting', function () {
  while (true) {
    if (use_accepting_states) {
      AcceptingState.Continuing()
      // AcceptingState.Stopping()
    }
    bp.sync({ waitFor: bp.all })
  }
})

