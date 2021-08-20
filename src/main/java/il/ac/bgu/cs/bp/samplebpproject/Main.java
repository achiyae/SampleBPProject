package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.model.*;
import il.ac.bgu.cs.bp.statespacemapper.GenerateAllTracesInspection;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.exports.DotExporter;

import java.nio.file.Paths;
import java.util.List;

public class Main {
  public static void main(String[] args) throws Exception {
    String name = "DiningPhilosophers";

    System.out.println("// start");
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
//    BProgram bprog = new ContextBProgram(name + "/dal.js", name + "/bl.js");
    BProgram bprog = new ResourceBProgram(name+".js");

    // You can use a different EventSelectionStrategy, for example:
    /* var ess = new PrioritizedBSyncEventSelectionStrategy();
    bprog.setEventSelectionStrategy(ess); */
    StateSpaceMapper mpr = new StateSpaceMapper();
    var res = mpr.mapSpace(bprog);
    System.out.println("// completed mapping the states graph");
    System.out.println(res.toString());

    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, name + ".dot").toString();
    new DotExporter(res,path,name).export();

    System.out.println("// done");
  }

  public static List<List<BEvent>> getAllPaths(GenerateAllTracesInspection.MapperResult res) {
    System.out.println("// Generated paths:");
    boolean findSimplePathsOnly = true; // acyclic paths
    int maxPathLength = Integer.MAX_VALUE;
    var paths = res.generatePaths(findSimplePathsOnly, maxPathLength);
    System.out.println(paths);
    return paths;
  }
}
