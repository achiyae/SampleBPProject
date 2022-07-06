package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.samplebpproject.levelCrossing.*;
import il.ac.bgu.cs.bp.statespacemapper.MapperResult;
import il.ac.bgu.cs.bp.statespacemapper.StateSpaceMapper;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.DotExporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.Exporter;
import il.ac.bgu.cs.bp.statespacemapper.jgrapht.exports.GoalExporter;
import org.jgrapht.nio.DefaultAttribute;
import org.apache.commons.cli.*;


import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.ConsoleHandler;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Main {
  private static Logger logger = Logger.getLogger(LevelCrossingMain.class.getName());
  private static MapperResult res = null;

  public static void main(String[] args) throws Exception {
    Options options = new Options();

    Option a = new Option("e", "example", true, "example. one of: TicTacToe|DiningPhilosophers|LevelCrossing");
    a.setRequired(true);
    options.addOption(a);

    Option b = new Option("m", "model", true, "model. one of: BP|PN");
    b.setRequired(true);
    options.addOption(b);

    Option f = new Option("n", "num-of-tracks", true, "number of tracks - for LevelCrossing example");
    f.setRequired(false);
    options.addOption(f);

    Option c = new Option("np", "no-paths", false, "Do not generate the csv file - for LevelCrossing example");
    c.setRequired(false);
    options.addOption(c);

    Option d= new Option("nh", "no-helper", false, "Remove helper events - for LevelCrossing example");
    d.setRequired(false);
    options.addOption(d);

    Option e = new Option("wf", "with-faults", false, "Add faults - for LevelCrossing example");
    e.setRequired(false);
    options.addOption(e);

    CommandLineParser parser = new DefaultParser();
    HelpFormatter formatter = new HelpFormatter();
    CommandLine cmd = null;//not a good practice, it serves it purpose

    try {
      cmd = parser.parse(options, args);
    } catch (ParseException ex) {
      System.out.println(ex.getMessage());
      formatter.printHelp("b-program to automata", options);

      System.exit(1);
    }
    System.out.println(cmd.getArgList());
    if (cmd.getOptionValue("example").equals("LevelCrossing")) {
      LevelCrossingMain.main(new String[]{cmd.getOptionValue("model"), cmd.getOptionValue("num-of-tracks"),
              cmd.hasOption("no-paths") ? "True" : null,
              cmd.hasOption("no-helper") ? "True" : null,
              cmd.hasOption("with-faults") ? "True" : null});
    } else {
      mainForNonLC(new String[]{cmd.getOptionValue("example"), cmd.getOptionValue("model")});
    }
  }

  public static void mainForNonLC(String[] args) throws Exception {

    if (args.length < 2) {
      System.out.println("The first argument must include the js filename and the second BP or PN");
      return;
    }
    setupLogger();
    logger.info("Args: " + Arrays.toString(args) + "\n");
    String dotFile = null;
    var filename = args[0] + "_" + args[1] + ".js";
    var runName = args[0] + "_" + args[1];
    var outputDir = "exports";

    printJVMStats();

    final BProgram bprog = new ResourceBProgram(filename);
    logger.info("// Start mapping the states graph");
    res = new StateSpaceMapper().mapSpace(bprog);
    logger.info("// Completed mapping the states graph");
    logger.info(res.toString());
    logger.info("-------------\n");
    exportGraph(outputDir, runName);



    logger.info("// done");

    System.exit(0);

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




}
