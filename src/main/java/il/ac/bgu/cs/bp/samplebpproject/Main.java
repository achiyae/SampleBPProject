package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;

public class Main {
  public static void main(String[] args) throws Exception {
    var bprog = createBProgram();
    var runName = bprog.getName();

    System.out.println("// start");

    var mpr = new StateSpaceMapper(bprog, runName);
    mpr.mapSpace();
    mpr.exportSpace();

//    mpr.writeCompressedPaths();

    System.out.println("// done");
  }

  private static BProgram createBProgram() {
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    // final BProgram bprog = new ResourceBProgram("DiningPhilosophers.js");
    final BProgram bprog = new ResourceBProgram("even.js");

    // You can use a different EventSelectionStrategy, for example:
     var ess = new PrioritizedBSyncEventSelectionStrategy();
    bprog.setEventSelectionStrategy(ess);

    return bprog;
  }
}
