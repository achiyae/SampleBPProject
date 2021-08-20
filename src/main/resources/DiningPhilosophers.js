function bthread(name, func) {
  return bp.registerBThread(name, func)
}

function sync(stmt) {
  return bp.sync(stmt)
}

const take = i => bp.Event("take " + i)
const put = i => bp.Event("put " + i)

const PHILOSOPHER_COUNT = 2

for (let i = 0; i < PHILOSOPHER_COUNT; i++) {
  // Add fork i behavior:
  bthread("Fork" + i, function () {
    while (true) {
      sync({waitFor: take(i), block: put(i)})
      sync({waitFor: put(i), block: take(i)})
    }
  })

  // Add philosopher i behavior:
  let j = (i + 1) % PHILOSOPHER_COUNT
  bthread("Philosopher" + i, function () {
    while (true) {
      sync({request: take(i)})
      sync({request: take(j)})
      sync({request: put(j)})
      sync({request: put(i)})
    }
  })
}