package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.model.*;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.GoalExporter;
import org.jgrapht.nio.DefaultAttribute;

import java.nio.file.Paths;
import java.util.Map;

public class Main {
  public static void main(String[] args) throws Exception {

    String name = "TicTacToe";

    System.out.println("// start");
    // This will load the program file  <Project>/src/main/resources/HelloBPjsWorld.js
    BProgram bprog = new ContextBProgram(name + "/dal.js", name + "/bl.js");
//    BProgram bprog = new ResourceBProgram(name+".js");

    // You can use a different EventSelectionStrategy, for example:
    bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
    StateSpaceMapper mpr = new StateSpaceMapper();
    var res = mpr.mapSpace(bprog);
    System.out.println("// completed mapping the states graph");
    System.out.println(res.toString());

    System.out.println("// Export to GraphViz...");
    var outputDir = "exports";
    var path = Paths.get(outputDir, name + ".dot").toString();
    var dotExporter = new DotExporter(res,path,name);
    dotExporter.setVertexAttributeProvider(v ->
        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    dotExporter.export();

    System.out.println("// Export to GOAL...");
    boolean simplifyTransitions = true;
    path = Paths.get(outputDir, name + ".gff").toString();
    var goalExporter = new GoalExporter(res, path, name, simplifyTransitions);
    goalExporter.setVertexAttributeProvider(v ->
        Map.of("hash", DefaultAttribute.createAttribute(v.hashCode()))
    );
    goalExporter.export();

    System.out.println("// done");
  }
}
