package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.internal.ScriptableUtils;
import il.ac.bgu.cs.bp.bpjs.model.*;
import il.ac.bgu.cs.bp.statespacemapper.GenerateAllTracesInspection;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.exports.DotExporter;
import org.jgrapht.nio.Attribute;
import org.jgrapht.nio.DefaultAttribute;
import org.jgrapht.nio.dot.DOTExporter;

import java.io.IOException;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

import static java.util.stream.Collectors.joining;

public class Main {
  public static void main(String[] args) throws Exception {
    String name = "HotCold";

    System.out.println("// start");
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    BProgram bprog = new ContextBProgram(name + "/dal.js", name + "/bl.js");

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
