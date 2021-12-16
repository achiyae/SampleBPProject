function behaviorSet0(input, index) {
  bp.registerBThread("O_Player_Thread_0_0", function(){
    bp.sync({waitFor:[O(input[3].x, input[3].y)]});
    bp.sync({request:[O(input[3].x, input[3].y)]},9);
    bp.sync({request: bp.Event("SET_0_THREAD_0_INPUT_" + index.toString())}, 115);
  });

  bp.registerBThread("O_Player_Thread_0_1", function(){
    bp.sync({waitFor:[X(input[3].x, input[3].y), O(input[0].x, input[0].y), X(input[2].x, input[2].y)]});
    bp.sync({waitFor:[O(input[1].x, input[1].y), X(input[4].x, input[4].y), X(input[6].x, input[6].y)]});
    bp.sync({request:[O(input[5].x, input[5].y)]},2);
    bp.sync({request: bp.Event("SET_0_THREAD_1_INPUT_" + index.toString())}, 115);
  });

}
var inputs_0 = [[{x: 2, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 1, y: 2}],
  [{x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 2, y: 0}, {x: 0, y: 2}],
  [{x: 2, y: 2}, {x: 1, y: 2}, {x: 1, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}],
  [{x: 1, y: 2}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 0, y: 0}, {x: 2, y: 1}],
  [{x: 1, y: 0}, {x: 0, y: 0}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 2, y: 0}, {x: 0, y: 2}, {x: 2, y: 0}],
  [{x: 1, y: 2}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 1}, {x: 0, y: 0}, {x: 2, y: 1}, {x: 0, y: 2}],
  [{x: 0, y: 2}, {x: 1, y: 2}, {x: 1, y: 2}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 2}, {x: 0, y: 0}],
  [{x: 2, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 0, y: 1}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}],
  [{x: 0, y: 0}, {x: 0, y: 2}, {x: 1, y: 1}, {x: 0, y: 2}, {x: 2, y: 0}, {x: 2, y: 2}, {x: 2, y: 2}]]
inputs_0.forEach(function (input, index) {
  behaviorSet0(input, index);
});

function behaviorSet1(input, index) {
  bp.registerBThread("O_Player_Thread_1_0", function(){
    bp.sync({waitFor:[X(input[1].x, input[1].y), X(input[1].x, input[1].y), X(input[0].x, input[0].y)]});
    bp.sync({request:[O(input[1].x, input[1].y)]},9);
    bp.sync({request: bp.Event("SET_1_THREAD_0_INPUT_" + index.toString())}, 115);
  });

}
var inputs_1 = [[{x: 1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
  [{x: 0, y: 1}, {x: 2, y: 2}, {x: 2, y: 0}],
  [{x: 2, y: 2}, {x: 0, y: 2}, {x: 2, y: 0}],
  [{x: 1, y: 2}, {x: 1, y: 0}, {x: 1, y: 1}],
  [{x: 0, y: 2}, {x: 2, y: 0}, {x: 1, y: 0}],
  [{x: 2, y: 2}, {x: 2, y: 0}, {x: 0, y: 1}],
  [{x: 2, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}],
  [{x: 2, y: 1}, {x: 0, y: 1}, {x: 1, y: 2}],
  [{x: 0, y: 2}, {x: 2, y: 2}, {x: 0, y: 1}]]
inputs_1.forEach(function (input, index) {
  behaviorSet1(input, index);
});

function behaviorSet2(input, index) {
  bp.registerBThread("O_Player_Thread_2_0", function(){
    bp.sync({waitFor:[O(input[2].x, input[2].y), O(input[2].x, input[2].y), O(input[2].x, input[2].y), O(input[2].x, input[2].y)]});
    bp.sync({request:[O(input[1].x, input[1].y)]},11);
    bp.sync({request: bp.Event("SET_2_THREAD_0_INPUT_" + index.toString())}, 115);
  });

  bp.registerBThread("O_Player_Thread_2_1", function(){
    bp.sync({request:[O(input[2].x, input[2].y), O(input[2].x, input[2].y)]},7);
    bp.sync({request: bp.Event("SET_2_THREAD_1_INPUT_" + index.toString())}, 115);
  });

}
var inputs_2 = [[{x: 1, y: 2}, {x: 1, y: 0}, {x: 1, y: 0}],
  [{x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 0}],
  [{x: 1, y: 2}, {x: 1, y: 2}, {x: 1, y: 1}],
  [{x: 2, y: 2}, {x: 2, y: 2}, {x: 2, y: 2}],
  [{x: 0, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}],
  [{x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: 2}],
  [{x: 1, y: 2}, {x: 1, y: 2}, {x: 0, y: 2}],
  [{x: 1, y: 1}, {x: 2, y: 2}, {x: 2, y: 2}]]
inputs_2.forEach(function (input, index) {
  behaviorSet2(input, index);
});

function behaviorSet3(input, index) {
  bp.registerBThread("O_Player_Thread_3_0", function(){
    bp.sync({request:[O(input[4].x, input[4].y), O(input[4].x, input[4].y)]},10);
    bp.sync({request: bp.Event("SET_3_THREAD_0_INPUT_" + index.toString())}, 115);
  });

  bp.registerBThread("O_Player_Thread_3_1", function(){
    bp.sync({waitFor:[X(input[2].x, input[2].y)]});
    bp.sync({waitFor:[O(input[2].x, input[2].y), O(input[3].x, input[3].y), O(input[5].x, input[5].y), O(input[2].x, input[2].y)]});
    bp.sync({request:[O(input[0].x, input[0].y)]},2);
    bp.sync({request: bp.Event("SET_3_THREAD_1_INPUT_" + index.toString())}, 115);
  });

  bp.registerBThread("O_Player_Thread_3_2", function(){
    bp.sync({waitFor:[X(input[1].x, input[1].y), O(input[4].x, input[4].y), X(input[1].x, input[1].y), X(input[2].x, input[2].y)]});
    bp.sync({request:[O(input[1].x, input[1].y), O(input[2].x, input[2].y), O(input[1].x, input[1].y)]},9);
    bp.sync({request: bp.Event("SET_3_THREAD_2_INPUT_" + index.toString())}, 115);
  });

}
var inputs_3 = [[{x: 1, y: 0}, {x: 2, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 2, y: 2}, {x: 0, y: 1}]]
inputs_3.forEach(function (input, index) {
  behaviorSet3(input, index);
});
