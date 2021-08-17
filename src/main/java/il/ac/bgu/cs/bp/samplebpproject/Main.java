package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.*;

public class Main {
  public static void main(String[] args) throws Exception {
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    final BProgram bprog = new ResourceBProgram("HelloBPjsWorld.js");

    BProgramRunner rnr = new BProgramRunner(bprog);

    // Print program events to the console
    rnr.addListener( new PrintBProgramRunnerListener() );

    // go!
    rnr.run();
  }
}
