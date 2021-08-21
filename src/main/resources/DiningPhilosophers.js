/* global bp */
function bthread(name, func) {
  bp.registerBThread(name, func)
}

function sync(stmt, data) {
  if (data)
    return bp.sync(stmt, data)
  return bp.sync(stmt)
}

const PHILOSOPHER_COUNT = 2

const Take = (i, side) => bp.Event('Take', {id: i, side: side})
const Put = (i, side) => bp.Event('Put', {id: i, side: side})
const TakeSemaphore = i => bp.Event('TakeSemaphore', i)
const ReleaseSemaphore = i => bp.Event('ReleaseSemaphore', i)
const AnyTakeSemaphore = ()=>bp.EventSet('AnyTakeSemaphore', function (e) {
  return e.name.equals(String('TakeSemaphore'))
})
const AnyReleaseSemaphore = ()=>bp.EventSet('AnyReleaseSemaphore', function (e) {
  return e.name.equals(String('ReleaseSemaphore'))
})
const AnyTake = (i) => [Take(i, "R"), Take((i % PHILOSOPHER_COUNT) + 1, "L")]
const AnyPut = (i) => [Put(i, "R"), Put((i % PHILOSOPHER_COUNT) + 1, "L")]

function bt(i) {
  bthread('Stick ' + i, function () {
    while (true) {
      bp.sync({waitFor: AnyTake(i), block: AnyPut(i)});
      bp.sync({waitFor: AnyPut(i), block: AnyTake(i)});
    }
  })

  bthread('Philosopher ' + i, function () {
    while (true) {
      // Request to pick the right stick
      sync({request: Take(i, 'R')});
      sync({request: Take(i, 'L')});
      sync({request: Put(i, 'L')});
      sync({request: Put(i, 'R')});
    }
  })

  bthread('Take semaphore '+i, function () {
    while (true) {
      sync({request: TakeSemaphore(i), block: Take(i, 'R')})
      sync({waitFor: Put(i, 'R')})
      sync({request: ReleaseSemaphore(i)})
    }
  })
}

for (let c = 0; c < PHILOSOPHER_COUNT; c++) {
  bt(c)
}

bthread('Semaphore', function () {
  while (true) {
    sync({waitFor: AnyTakeSemaphore()})
    sync({waitFor: AnyReleaseSemaphore(), block: AnyTakeSemaphore()})
  }
})