package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.analysis.DfsBProgramVerifier;
import il.ac.bgu.cs.bp.bpjs.analysis.listeners.PrintDfsVerifierListener;
import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.*;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.Exporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.GoalExporter;
import org.jgrapht.GraphPath;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Main {
  private String name;
  private BProgram bprog;
  private Example example = null;

  public static void main(String[] args) throws Exception {
    var main = new Main();
    System.out.println("// start");

    main.createBProgam();

//    main.runProgram();
//    main.verifyProgram();
    main.mapSpace();

    System.out.println("// done");
  }

  private void createBProgam() {
    //region Load example program
    example = Example.HotCold;
    this.bprog = new ContextBProgram(example.getResourcesNames());
    example.initializeBProg(bprog);
    this.name = example.name;
    //endregion

    //region Load non-sample program
    /*
    // To load non-sample program (i.e., for example the program <Project>/src/main/resources/HelloBPjsWorld.js)
     this.bprog = new ContextBProgram("HelloBPjsWorld.js"); // you can add more files
     this.name = "HelloBPjsWorld";

    // You can use a different EventSelectionStrategy, for example:
     bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
     */
    //endregion
  }

  private void verifyProgram() throws IOException {
    if (example != null) {
      example.addVerificationResources(bprog);
    }
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

  private void runProgram() {
    var rnr = new BProgramRunner(bprog);
    if(example != null) {
      example.initializeRunner(rnr);
    } else {
      rnr.addListener(new PrintBProgramRunnerListener());
    }
    rnr.run();
  }

  private void mapSpace() throws Exception {
    if (example != null) {
      example.addVerificationResources(bprog);
    }
    StateSpaceMapper mpr = new StateSpaceMapper();
    var res = mpr.mapSpace(bprog);
    System.out.println("// completed mapping the states graph");
    System.out.println(res.toString());
    writeGraphs(res);

    // Generates a compressed file with all possible paths. Could be huge.
//    writeCompressedPaths(name + ".csv", null, res, "exports");
  }

  private Exporter formatExporter(Exporter e){
    e.setVertexAttributeProvider(mapperVertex -> Map.of());
    return e;
  }

  private void writeGraphs(MapperResult res) throws IOException {
    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, name + ".dot").toString();
    formatExporter(new DotExporter(res, path, name)).export();

    System.out.println("// Export to GOAL...");
    boolean simplifyTransitions = true;
    path = Paths.get(outputDir, name + ".gff").toString();
    var goalExporter = new GoalExporter(res, path, name, simplifyTransitions);
    formatExporter(goalExporter).export();
  }

  private void writeCompressedPaths(String csvFileName, Integer maxPathLength, MapperResult res, String outputDir) throws IOException {
    System.out.println("// Generating paths...");
    var allDirectedPathsAlgorithm = res.createAllDirectedPathsBuilder()
        .setSimplePathsOnly(maxPathLength == null)
        .setIncludeReturningEdgesInSimplePaths(maxPathLength == null)
        .setLongestPathsOnly(false)
        .setMaxPathLength(maxPathLength)
        .build();
    var graphPaths = allDirectedPathsAlgorithm.getAllPaths();

    int maxLength = graphPaths.parallelStream().map(GraphPath::getLength).max(Integer::compareTo).orElse(0);
    System.out.println("// Number of paths = " + graphPaths.size());
    System.out.println("// Max path length = " + maxLength);

    System.out.println("// Writing paths...");
    try (var fos = new FileOutputStream(Paths.get(outputDir, csvFileName) + ".zip");
         var zipOut = new ZipOutputStream(fos)) {
      var zipEntry = new ZipEntry(csvFileName);
      zipOut.putNextEntry(zipEntry);
      zipOut.setLevel(9);
      MapperResult.GraphPaths2BEventPaths(graphPaths)
          .parallelStream()
          .map(l -> l.stream()
              .map(e -> {
                if (e.name.equals("X") || e.name.equals("O")) {
                  return e.name + "(" + ((Map<String, Object>) e.maybeData).get("row") + "," + ((Map<String, Object>) e.maybeData).get("col") + ")";
                } else return e.name;
              })
//            .filter(s -> !List.of("KeepDown", "ClosingRequest", "OpeningRequest").contains(s))
              .collect(Collectors.joining(",", "", "\n")))
          .distinct()
          .sorted()
          .forEachOrdered(s -> {
            try {
              zipOut.write(s.getBytes(StandardCharsets.UTF_8));
            } catch (IOException e) {
              e.printStackTrace();
            }
          });
    }
  }
}
