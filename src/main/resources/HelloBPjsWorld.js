/* global bp */

/**
 * Simple "Hello world" program.
 */

bp.registerBThread( "helloBT", function(){
  bp.sync( {request:bp.Event("Hello,")} );
} );

bp.registerBThread( "worldBT", function(){
  bp.sync( {request:bp.Event("World!")} );
} );

bp.registerBThread( "arbiter", function(){
  bp.sync( {waitFor:bp.Event("Hello,"),
    block:bp.Event("World!")} );
} );