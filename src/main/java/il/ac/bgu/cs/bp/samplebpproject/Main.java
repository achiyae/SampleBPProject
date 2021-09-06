package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.statespacemapper.GenerateAllTracesInspection;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import org.jgrapht.nio.DefaultAttribute;

import java.nio.file.Paths;
import java.util.Map;

public class Main {
  public static void main(String[] args) throws Exception {
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    final BProgram bprog = new ResourceBProgram(args);
    var runName = bprog.getName();

    // You can use a different EventSelectionStrategy, for example:
    /* var ess = new PrioritizedBSyncEventSelectionStrategy();
    bprog.setEventSelectionStrategy(ess); */
    var mpr = new StateSpaceMapper();
    var res = mpr.mapSpace(bprog);
    System.out.println("// completed mapping the states graph");
    System.out.println(res.toString());

    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, runName + ".dot").toString();
    var exporter = new DotExporter(res, path, runName);
    exporter.setVertexAttributeProvider(v ->
        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    exporter.export();

    getAllPaths(res);

    System.out.println("// done");
  }

  public static void getAllPaths(GenerateAllTracesInspection.MapperResult res) {
    System.out.println("// Generated paths:");
    var paths = res.generatePaths();
    System.out.println(paths);
  }
}
