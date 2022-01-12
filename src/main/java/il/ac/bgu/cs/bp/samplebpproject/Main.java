package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.GoalExporter;
import org.jgrapht.GraphPath;
import org.jgrapht.nio.DefaultAttribute;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Main {
  public static void main(String[] args) throws Exception {
    var bprog = createBProgram();
    var runName = bprog.getName();

    System.out.println("// start");

    var res = mapSpace(bprog);

    writeGraphs(res, runName);

    // Generates a compressed file with all possible paths. Could be huge.
    // writeCompressedPaths(runName + ".csv", null, res, "exports");

    System.out.println("// done");
  }

  private static BProgram createBProgram() {
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    // final BProgram bprog = new ResourceBProgram("DiningPhilosophers.js");
    final BProgram bprog = new ResourceBProgram("HelloBPjsWorld.js");

    // You can use a different EventSelectionStrategy, for example:
    /* var ess = new PrioritizedBSyncEventSelectionStrategy();
    bprog.setEventSelectionStrategy(ess); */

    return bprog;
  }

  private static MapperResult mapSpace(BProgram bprog) throws Exception {
    StateSpaceMapper mpr = new StateSpaceMapper();
    var res = mpr.mapSpace(bprog);
    System.out.println("// completed mapping the states graph");
    System.out.println(res.toString());
    return res;
  }

  private static void writeGraphs(MapperResult res, String name) throws IOException {
    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, name + ".dot").toString();
    var dotExporter = new DotExporter(res, path, name);

    // Change vertex attributes, see StateSpaceMapper documentation.
    dotExporter.setVertexAttributeProvider(v ->
        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    dotExporter.export();

    System.out.println("// Export to GOAL...");
    boolean simplifyTransitions = true;
    path = Paths.get(outputDir, name + ".gff").toString();
    var goalExporter = new GoalExporter(res, path, name, simplifyTransitions);
    goalExporter.export();
  }

  private static void writeCompressedPaths(String csvFileName, Integer maxPathLength, MapperResult res, String outputDir) throws IOException {
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
