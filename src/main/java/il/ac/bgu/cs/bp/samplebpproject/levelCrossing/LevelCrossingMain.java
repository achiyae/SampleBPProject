package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.stream.Collectors;

public class LevelCrossingMain {
  // Program arguments = args[0] = filename without ".js", args[1] = n
  // For example: args = ["levelCrossing/lc_pn_check", "1"]
  public static void main(String[] args) throws Exception {
    var n = Integer.parseInt(args[1]);
    var filename = args[0] + ".js";
    var runName = args[0] + "_" + n;
    final BProgram bprog = new ResourceBProgram(filename);
    bprog.putInGlobalScope("n", n);

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
    exporter.export();

    System.out.println("// Generating paths...");
    var paths = res.generatePaths()
        .stream()
        .map(l -> l
            .stream()
            .map(e -> e.name)
            .collect(Collectors.joining(",")))
        .collect(Collectors.joining("\n"));
    Files.writeString(Paths.get(outputDir, runName + ".csv"), paths);

    System.out.println("// Writing paths...");

    System.out.println("// done");
  }
}
