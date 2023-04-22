package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.analysis.DfsBProgramVerifier;
import il.ac.bgu.cs.bp.bpjs.analysis.listeners.PrintDfsVerifierListener;
import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.statespacemapper.SpaceMapperCliRunner;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.Optional;

public class Main extends SpaceMapperCliRunner {
  public static void main(String[] args) throws Exception {
    var main = new Main();
    BProgram bprog;
    String name;
    Optional<SampleDomain> sampleDomain = Optional.empty();
    System.out.println("// start");

    // load a bprogram of a sample domain
    sampleDomain = Optional.of(SampleDomain.HotCold);
    bprog = loadSampleDomain(sampleDomain.get());
    name = sampleDomain.get().name;

    // alternatively, load a bprogram from resources
    /*
    var resources = args.length == 0 ? new String[]{"HelloBPjsWorld.js"} : args;
    bprog = cli.getBProgram(resources);
    name = bprog.getName();
    // You can use a different EventSelectionStrategy, for example:
    bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
    */

    // run the program:
//     main.runProgram(bprog, sampleDomain);

    // verify the program:
//     main.verifyProgram(bprog, sampleDomain);

    // map the state space of the program:
    var map = main.mapSpace(bprog);

    // write the graph to files:
    main.exportSpace(name, map);

    // Generates a compressed file with all possible paths. Could be huge.
//    main.writeCompressedPaths(name + ".csv", null, map, "exports");

    System.out.println("// done");
  }

  private static BProgram loadSampleDomain(SampleDomain domain) {
    var bprog = new ContextBProgram(domain.getResourcesNames());
    domain.initializeBProg(bprog);
    return bprog;
  }

  private void verifyProgram(BProgram bprog, Optional<SampleDomain> sampleDomain) {
    sampleDomain.ifPresent(sample -> {
      try {
        sample.addVerificationResources(bprog);
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    });
    var vfr = new DfsBProgramVerifier();
    vfr.setMaxTraceLength(2000);
    vfr.setProgressListener(new PrintDfsVerifierListener());
    vfr.setIterationCountGap(100);
//    vfr.setDebugMode(true);
    try {
      var res = vfr.verify(bprog);
      System.out.println(MessageFormat.format(
        "States = {0}\n" +
          "Edges = {1}\n" +
          "Time = {2}",
        res.getScannedStatesCount(), res.getScannedEdgesCount(), res.getTimeMillies()));
      if (res.isViolationFound())
        System.out.println(MessageFormat.format("Found violation: {0}", res.getViolation().get()));
      else
        System.out.println("No violation found");
    } catch (Exception e) {
      e.printStackTrace();
      System.exit(1);
    }
  }

  private static void runProgram(BProgram bprog, Optional<SampleDomain> sampleDomain) {
    var rnr = new BProgramRunner(bprog);
    sampleDomain.ifPresentOrElse(
      sample -> sample.initializeRunner(rnr), () -> rnr.addListener(new PrintBProgramRunnerListener()));
    rnr.run();
  }
}
