/* global bp */

/**
 * Simple "Hello world" program.
 */

bp.registerBThread("a", function () {
  let ans = new Set()
  bp.sync({request: bp.Event("a")});
});
