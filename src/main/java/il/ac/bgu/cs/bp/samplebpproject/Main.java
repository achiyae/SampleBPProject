package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;

public class Main {

  public static void main(String[] args) {
    var bprog = new ContextBProgram("HotCold/dal.js", "HotCold/bl.js");
    var rnr = new BProgramRunner(bprog);
    rnr.addListener(new PrintBProgramRunnerListener());
    rnr.run();
  }
}
