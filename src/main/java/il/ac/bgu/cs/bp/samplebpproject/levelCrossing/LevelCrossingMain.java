package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import org.jgrapht.nio.DefaultAttribute;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.stream.Collectors;

public class LevelCrossingMain {
  // Program arguments = args[0] = filename without ".js", args[1] = n
  // For example: args = ["lc_pn_check", "1"]
  public static void main(String[] args) throws Exception {
    System.out.println("Run name: "+ args[0] +"_"+args[1]);

    var n = Integer.parseInt(args[1]);
    var filename = args[0] + ".js";
    var runName = args[0] + "_" + n;
    final BProgram bprog = new ResourceBProgram(filename);
    bprog.putInGlobalScope("n", n);

    printJVMStats();

    // You can use a different EventSelectionStrategy, for example:
    /* var ess = new PrioritizedBSyncEventSelectionStrategy();
    bprog.setEventSelectionStrategy(ess); */
    var mpr = new StateSpaceMapper();

    System.out.println("// Start mapping the states graph");
    var res = mpr.mapSpace(bprog);
    System.out.println("// Completed mapping the states graph");
    System.out.println(res.toString());

    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, runName + ".dot").toString();
    var exporter = new DotExporter(res, path, runName);
    exporter.setVertexAttributeProvider(v -> Map.of()
//        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    exporter.setEdgeAttributeProvider(v-> Map.of(
        "label", DefaultAttribute.createAttribute(v.event.name)
    ));
    exporter.export();

    System.out.println("// Generating paths...");
    var allDirectedPathsAlgorithm = res.createAllDirectedPathsBuilder()
        .setSimplePathsOnly(true)
        .setIncludeReturningEdgesInSimplePaths(true)
        .setLongestPathsOnly(false)
        .build();
    var graphPaths = allDirectedPathsAlgorithm.getAllPaths();
    System.out.println("// Generating paths strings...");
    var paths = MapperResult.GraphPaths2BEventPaths(graphPaths)
        .stream()
        .map(l -> l.stream()
            .map(BEvent::getName)
            .collect(Collectors.joining(", ")))
        .distinct()
        .sorted()
        .collect(Collectors.joining("\n"));

    System.out.println("// Writing paths...");
    Files.writeString(Paths.get(outputDir, runName + ".csv"), paths);

    System.out.println("// done");
  }

  private static void printJVMStats() {
    System.out.println("Available processors (cores): " +
        Runtime.getRuntime().availableProcessors());

    /* Total amount of free memory available to the JVM */
    System.out.println("Free memory (bytes): " +
        Runtime.getRuntime().freeMemory());

    /* This will return Long.MAX_VALUE if there is no preset limit */
    long maxMemory = Runtime.getRuntime().maxMemory();
    /* Maximum amount of memory the JVM will attempt to use */
    System.out.println("Maximum memory (bytes): " +
        (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory));

    /* Total memory currently in use by the JVM */
    System.out.println("Total memory (bytes): " +
        Runtime.getRuntime().totalMemory());
  }
}
