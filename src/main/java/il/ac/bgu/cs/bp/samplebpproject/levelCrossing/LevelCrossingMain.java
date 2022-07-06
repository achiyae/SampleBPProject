package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.BThreadSyncSnapshot;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.MapperEdge;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.MapperVertex;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.Exporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.GoalExporter;
import org.jgrapht.Graph;
import org.jgrapht.GraphPath;
import org.jgrapht.graph.DirectedPseudograph;
import org.jgrapht.nio.Attribute;
import org.jgrapht.nio.DefaultAttribute;
import org.jgrapht.nio.dot.DOTImporter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.*;
import java.util.logging.ConsoleHandler;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class LevelCrossingMain {
  private static Logger logger = Logger.getLogger(LevelCrossingMain.class.getName());
  private static MapperResult res = null;

  public static void main(String[] args) throws Exception {
    setupLogger();
    logger.info("Args: " + Arrays.toString(args) + "\n");
    String dotFile = null;
    if (args[0].contains(".dot")) {
      dotFile = args[0];
      args = Arrays.copyOfRange(args, 1, args.length);
    }
    int railways;
    if (args[1] == null){
      railways = 1;
    } else {
      railways = Integer.parseInt(args[1]);
    }
    String filename = null;
    String runName = null;
    if (args[0].equals("BP")){
      if (args[4] == null){
        filename = "levelCrossing/" + "lc_bp" + ".js";
        runName = "lc_bp" + "_R-" + railways;
      } else {
        filename = "levelCrossing/" + "lc_bp_faults" + ".js";
        runName = "lc_bp_faults" + "_R-" + railways;
      }
    } else {
      if (args[4] == null){
        filename = "levelCrossing/" + "lc_pn" + ".js";
        runName = "lc_pn" + "_R-" + railways;
      } else {
        filename = "levelCrossing/" + "lc_pn_faults" + ".js";
        runName = "lc_pn_faults" + "_R-" + railways;
      }
    }
    var csvName = runName + ".csv";
    var outputDir = "exports";
//    Integer maxPathLength = null;
//    if (args.length == 3) {
//      maxPathLength = Integer.valueOf(args[2]);
//      csvName = runName + "_L-" + maxPathLength + ".csv";
//    }

    printJVMStats();

    if (dotFile == null) {
      res = mapSpace(railways, filename);
      exportGraph(outputDir, runName);

      if (runName.startsWith("lc_pn") && args[3] != null) {
//        findProblemEquals(res);
        res = PNMapperResults.removeHelperEvents(res);
        exportGraph(outputDir, runName + "_compressed");
      }
    } else {
      res = importStateSpace(dotFile);
    }
//    if (railways < 3 || (railways < 4 && !runName.contains("faults"))) {
//      generatePaths(csvName, maxPathLength, outputDir);
//    }
    if (args[2] == null) {
      generatePaths(csvName, 20, outputDir); // can increase maxPathLength
    }

    logger.info("// done");

    System.exit(0); // To complete the garbage collection before terminating the program. Solves Maven exceptions.
  }

  private static void findProblemEquals(MapperResult res) {
    var allDirectedPathsAlgorithm = res.createAllDirectedPathsBuilder()
        .setSimplePathsOnly(false)
        .setIncludeReturningEdgesInSimplePaths(false)
        .setLongestPathsOnly(false)
        .setMaxPathLength(7)
        .build();
    var problematicPath = allDirectedPathsAlgorithm.getAllPaths()
        .stream().filter(p -> {
          var edges = p.getEdgeList();
          if (edges.isEmpty()) return false;
          return edges.get(edges.size() - 1).event.name.equals(Raise.NAME);
        }).findFirst().get();
    var start = problematicPath.getStartVertex().bpss.getBThreadSnapshots().stream().sorted(Comparator.comparing(BThreadSyncSnapshot::getName)).collect(Collectors.toList());
    var end = problematicPath.getEndVertex().bpss.getBThreadSnapshots().stream().sorted(Comparator.comparing(BThreadSyncSnapshot::getName)).collect(Collectors.toList());
    for (int i = 0; i < start.size(); i++) {
      var s = start.get(i);
      var e = end.get(i);
      System.out.println(MessageFormat.format("{0} {1} {2} {3}", i, s.getName(), e.getName(), s.equals(e)));
    }
    System.out.println(start.equals(end));
    System.out.println("end");
    System.exit(1);
  }

  private static void setupLogger() {
    logger.setUseParentHandlers(false);
    ConsoleHandler handler = new ConsoleHandler();
    handler.setFormatter(new SimpleFormatter() {
      private static final String format = "[%1$tF %1$tT] [%2$-7s] %3$s %n";

      @Override
      public synchronized String format(LogRecord lr) {
        return String.format(format,
            new Date(lr.getMillis()),
            lr.getLevel().getLocalizedName(),
            lr.getMessage()
        );
      }
    });
    logger.addHandler(handler);
  }

  private static MapperResult mapSpace(int railways, String filename) throws Exception {
    final BProgram bprog = new ResourceBProgram(filename);
    bprog.putInGlobalScope("n", railways * 1.0);
    logger.info("// Start mapping the states graph");
    MapperResult res = new StateSpaceMapper().mapSpace(bprog);
    logger.info("// Completed mapping the states graph");
    logger.info(res.toString());
    logger.info("-------------\n");
    return res;
  }

  private static MapperResult importStateSpace(String dotFile) {
    logger.info("// Importing the states graph");
    var graph = new DirectedPseudograph<MapperVertex, MapperEdge>(MapperEdge.class);
    var importer = new DOTImporter<MapperVertex, MapperEdge>();
    importer.setVertexWithAttributesFactory(MapperVertexExtended::new);
    importer.setEdgeWithAttributesFactory(MapperEdgeExtended::new);
    importer.importGraph(graph, new File(dotFile));
    /*var startVertex = graph.vertexSet().stream().filter(v -> ((MapperVertexExtended) v).start).findFirst().get();
    var acceptingVertices = graph.vertexSet().stream().filter(v -> ((MapperVertexExtended) v).accepting).collect(Collectors.toSet());*/
    return new PNMapperResults(graph);
  }

  private static void generatePaths(String csvName, Integer maxPathLength, String outputDir) throws IOException {
    logger.info("// Generating paths...");
    var allDirectedPathsAlgorithm = res.createAllDirectedPathsBuilder()
        .setSimplePathsOnly(maxPathLength == null)
        .setIncludeReturningEdgesInSimplePaths(maxPathLength == null)
        .setLongestPathsOnly(false)
        .setMaxPathLength(maxPathLength)
        .build();
    var graphPaths = allDirectedPathsAlgorithm.getAllPaths();
    res = null;
    int maxLength = graphPaths.parallelStream().map(GraphPath::getLength).max(Integer::compareTo).orElse(0);
    logger.info("// Number of paths = " + graphPaths.size());
    logger.info("// Max path length = " + maxLength);

    logger.info("// Writing paths...");
    try (var fos = new FileOutputStream(Paths.get(outputDir, csvName) + ".zip");
         var zipOut = new ZipOutputStream(fos)) {
      var zipEntry = new ZipEntry(csvName);
      zipOut.putNextEntry(zipEntry);
      zipOut.setLevel(9);
      MapperResult.GraphPaths2BEventPaths(graphPaths)
          .parallelStream()
          .map(l -> l.stream()
              .map(BEvent::toString)
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

  private static void exportGraph(String outputDir, String runName) throws IOException {
    logger.info("// Export to GraphViz...");
    var path = Paths.get(outputDir, runName + ".dot").toString();
    Exporter exporter = new DotExporter(res, path, runName);
    exporter.setEdgeAttributeProvider(v -> Map.of(
        "label", DefaultAttribute.createAttribute(v.event.toString())
    ));
    exportGraph(exporter);

    logger.info("// Export to GOAL...");
    path = Paths.get(outputDir, runName + ".gff").toString();
    exporter = new GoalExporter(res, path, runName, true);
    exportGraph(exporter);
  }

  private static void exportGraph(Exporter exporter) throws IOException {
    var vertexProvider = exporter.getVertexAttributeProvider();
    exporter.setVertexAttributeProvider(v -> {
      var map = vertexProvider.apply(v);
      map.remove("store");
      map.remove("statements");
      map.remove("bthreads");
      return map;
    });
    exporter.export();
  }

  private static void printJVMStats() {
    logger.info("-------------");
    logger.info("Available processors (cores): " +
        Runtime.getRuntime().availableProcessors());

    /* Total amount of free memory available to the JVM */
    logger.info("Free memory (bytes): " +
        Runtime.getRuntime().freeMemory());

    /* This will return Long.MAX_VALUE if there is no preset limit */
    long maxMemory = Runtime.getRuntime().maxMemory();
    /* Maximum amount of memory the JVM will attempt to use */
    logger.info("Maximum memory (bytes): " +
        (maxMemory == Long.MAX_VALUE ? "no limit" : maxMemory));

    /* Total memory currently in use by the JVM */
    logger.info("Total memory (bytes): " +
        Runtime.getRuntime().totalMemory());
    logger.info("-------------\n");
  }

  private static class PNMapperResults extends MapperResult {
    private PNMapperResults(Graph<MapperVertex, MapperEdge> graph) {
      super(graph);
    }

    public static PNMapperResults removeHelperEvents(MapperResult base) {
      logger.info("// Compressing the PN graph");

      var startNode = base.startVertex();
      var graph = base.graph;
//      var i = 0;
      while (true) {
        // find edge to remove. using sequential stream and not parallel - to get the same result every time.
        var edge = graph.edgeSet().stream()
            .sorted((o1, o2) -> {
              var o1s = graph.getEdgeSource(o1).hashCode();
              var o1t = graph.getEdgeTarget(o1).hashCode();
              var o2s = graph.getEdgeSource(o2).hashCode();
              var o2t = graph.getEdgeTarget(o2).hashCode();
              if (o1s == o2s) return Integer.compare(o1t, o2t);
              return Integer.compare(o1s, o2s);
            })
            .filter(e -> List.of(KeepDown.NAME, ClosingRequest.NAME, OpeningRequest.NAME).contains(e.event.name))
            .findFirst().orElse(null);
        if (edge == null) break;
//        logger.info("Removing " + edge.event.toString());
        var source = graph.getEdgeSource(edge);
        var target = graph.getEdgeTarget(edge);
        var targetOut = new ArrayList<>(graph.outgoingEdgesOf(target));
        for (var e : targetOut) {
          var eTarget = graph.getEdgeTarget(e);
          if (graph.outgoingEdgesOf(source).stream().map(e1 -> e1.event).noneMatch(e1 -> e1.equals(e.event)))
            graph.addEdge(source, eTarget, new MapperEdge(e.event));
        }
        graph.removeEdge(edge);
//        graph.removeVertex(source); // this line make the graph look like the one in the paper, however it is not correct to do so in all cases...
//        exportGraph("exports", "log" + i, new PNMapperResults(graph, startNode, graph.vertexSet()));
//        i++;
      }
      while (true) {
        var zeroInDegree = graph.vertexSet().stream().filter(v -> !v.equals(startNode) && graph.inDegreeOf(v) == 0).collect(Collectors.toList());
        if (zeroInDegree.isEmpty()) break;
        graph.removeAllVertices(zeroInDegree);
      }
      var res = new PNMapperResults(graph);
      logger.info(res.toString());
      return res;
    }
  }

  static class MapperVertexExtended extends MapperVertex {
    private final int id;
    public final boolean start;
    public final boolean accepting;

    public MapperVertexExtended(String s, Map<String, Attribute> stringAttributeMap) {
      super(null);
      id = Integer.parseInt(s);
      if (stringAttributeMap.containsKey("start")) {
        start = Boolean.parseBoolean(stringAttributeMap.get("start").getValue());
        accepting = Boolean.parseBoolean(stringAttributeMap.get("accepting").getValue());
      } else {
        start = s.equals("1");
        accepting = true;
      }
    }

    @Override
    public boolean equals(Object o) {
      if (!(o instanceof MapperVertexExtended)) return false;
      return id == ((MapperVertexExtended) o).id;
    }

    @Override
    public int hashCode() {
      return id;
    }
  }

  static class MapperEdgeExtended extends MapperEdge {
    private static BEvent getEvent(String name) {
      switch (name.charAt(0)) {
        case 'A':
          if (name.length() == 2)
            return new Approaching(Integer.parseInt(name.substring(1)));
          else
            return new Approaching();
        case 'C':
          if (name.length() == 3)
            return new ClosingRequest(Integer.parseInt(name.substring(2)));
          else
            return new ClosingRequest();
        case 'E':
          if (name.length() == 2)
            return new Entering(Integer.parseInt(name.substring(1)));
          else
            return new Entering();
        case 'F':
          if (name.charAt(1) == 'R') {
            return new FaultRaise();
          } else {
            if (name.length() == 3)
              return new FaultEntering(Integer.parseInt(name.substring(2)));
            else
              return new FaultEntering();
          }
        case 'K':
          if (name.length() == 3)
            return new KeepDown(Integer.parseInt(name.substring(2)));
          else
            return new KeepDown();
        case 'L':
          if (name.charAt(1) == 'e') {
            if (name.length() == 3) {
              return new Leaving(Integer.parseInt(name.substring(2)));
            } else {
              return new Leaving();
            }
          } else {
            return new Lower();
          }
        case 'O':
          if (name.length() == 3)
            return new OpeningRequest(Integer.parseInt(name.substring(2)));
          else
            return new OpeningRequest();
        case 'R':
          return new Raise();
        default:
          throw new IllegalArgumentException();
      }
    }

    public MapperEdgeExtended(Map<String, Attribute> attributes) {
      super(getEvent(attributes.get("label").getValue()));
    }
  }
}