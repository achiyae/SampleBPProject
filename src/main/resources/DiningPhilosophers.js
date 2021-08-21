/* global bp */
function bthread(name, func) {
  bp.registerBThread(name, func)
}

function sync(stmt, data) {
  if (data)
    return bp.sync(stmt, data)
  return bp.sync(stmt)
}

const PHILOSOPHER_COUNT = 3;

const Take = (i, side) => bp.Event('Take' + i + side)
const Put = (i, side) => bp.Event('Put' + i + side)
const AnyTake = (i) => [bp.Event("Take" + i + "R"), bp.Event("Take" + ((i + 1) % PHILOSOPHER_COUNT) + "L")]
const AnyPut = (i) => [bp.Event("Put" + i + "R"), bp.Event("Put" + ((i + 1) % PHILOSOPHER_COUNT) + "L")]

for (let c = 0; c < PHILOSOPHER_COUNT; c++) {
  let i = c;

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
      sync({request: Put(i, 'R')});
      sync({request: Put(i, 'L')});
    }
  })
}