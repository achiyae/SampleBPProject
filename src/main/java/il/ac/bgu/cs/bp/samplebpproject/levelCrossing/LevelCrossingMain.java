package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.MapperEdge;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.MapperVertex;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import org.jgrapht.Graph;
import org.jgrapht.nio.DefaultAttribute;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class LevelCrossingMain {
  // Program arguments =
  //    args[0] = lc_bp | lc_pn | lc_bp_faults | lc_pn_faults
  //    args[1] = number of railways
  //    args[2] (optional) = max path length
  // For example: args = ["lc_pn_check", "1"]
  public static void main(String[] args) throws Exception {
    System.out.println("Run name: " + args[0] + "_" + args[1]);

    var railways = Integer.parseInt(args[1]);
    var filename = "levelCrossing/" + args[0] + ".js";
    var runName = args[0] + "_R-" + railways;
    var csvName = runName + ".csv";
    var outputDir = "exports";
    Integer maxPathLength = null;
    if (args.length == 3) {
      maxPathLength = Integer.valueOf(args[2]);
      csvName = runName + "_L-" + maxPathLength + ".csv";
    }
    final BProgram bprog = new ResourceBProgram(filename);
    bprog.putInGlobalScope("n", railways);

    printJVMStats();

    System.out.println("// Start mapping the states graph");
    var res = new StateSpaceMapper().mapSpace(bprog);
    System.out.println("// Completed mapping the states graph");
    System.out.println(res.toString());

    exportGraph(outputDir, runName, res);

    if (runName.startsWith("lc_pn")) {
      System.out.println("// Compressing the PN graph");
      res = PNMapperResults.CompressGraph(res);
      System.out.println(res);
      exportGraph(outputDir, runName + "_compressed", res);
    }

    generatePaths(csvName, maxPathLength, res, outputDir);

    System.out.println("// done");
  }

  private static void generatePaths(String csvName, Integer maxPathLength, MapperResult res, String outputDir) throws IOException {
    System.out.println("// Generating paths...");
    var allDirectedPathsAlgorithm = res.createAllDirectedPathsBuilder()
        .setSimplePathsOnly(maxPathLength == null)
        .setIncludeReturningEdgesInSimplePaths(false)
        .setLongestPathsOnly(false)
        .setMaxPathLength(maxPathLength)
        .build();
    var graphPaths = allDirectedPathsAlgorithm.getAllPaths();
    System.out.println("// Generating paths strings...");
    var paths = MapperResult.GraphPaths2BEventPaths(graphPaths)
        .stream()
        .map(l -> l.stream()
            .map(BEvent::getName)
            .filter(s -> !List.of("KeepDown", "ClosingRequest", "OpeningRequest").contains(s))
            .collect(Collectors.joining(",")))
        .distinct()
        .sorted()
        .collect(Collectors.joining("\n"));

    System.out.println("// Writing paths...");
    Files.writeString(Paths.get(outputDir, csvName), paths);
  }

  private static void exportGraph(String outputDir, String runName, MapperResult res) throws IOException {
    System.out.println("// Export to GraphViz...");
    var path = Paths.get(outputDir, runName + ".dot").toString();
    var exporter = new DotExporter(res, path, runName);
    exporter.setVertexAttributeProvider(v -> Map.of()
//        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    exporter.setEdgeAttributeProvider(v -> Map.of(
        "label", DefaultAttribute.createAttribute(v.event.name)
    ));
    exporter.export();
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

  private static class PNMapperResults extends MapperResult {
    private PNMapperResults(Graph<MapperVertex, MapperEdge> graph, MapperVertex startNode, Set<MapperVertex> acceptingStates) {
      super(graph, startNode, acceptingStates);
    }

    public static PNMapperResults CompressGraph(MapperResult base) throws IOException {
      var startNode = base.startNode;
      var graph = base.graph;
//      var i = 0;
      while (true) {
        var edge = graph.edgeSet().parallelStream()
            .filter(e -> List.of("KeepDown", "ClosingRequest", "OpeningRequest").contains(e.event.name))
            .findAny().orElse(null);
        if (edge == null) break;
        System.out.println("Removing " + edge.event.name);
        var source = graph.getEdgeSource(edge);
        var target = graph.getEdgeTarget(edge);
        var sourceInEdges = new ArrayList<>(graph.incomingEdgesOf(source));
        for (var e : sourceInEdges) {
          var eSource = graph.getEdgeSource(e);
          if (graph.getAllEdges(eSource,target).parallelStream().noneMatch(e1 -> e1.event.equals(e.event)))
            graph.addEdge(eSource,target, new MapperEdge(e.event));
        }
        graph.removeEdge(edge);
//        graph.removeVertex(source); // this line make the graph look like the one in the paper, however it is not correct to do so in all cases...
//        exportGraph("exports", "log" + i, new PNMapperResults(graph, startNode, graph.vertexSet()));
//        i++;
      }
      graph.removeAllVertices(graph.vertexSet().stream().filter(v->!v.equals(startNode) && graph.inDegreeOf(v)==0).collect(Collectors.toList()));
      return new PNMapperResults(graph, startNode, graph.vertexSet());
    }
  }
}
