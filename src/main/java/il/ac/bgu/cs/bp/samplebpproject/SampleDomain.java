package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;
import il.ac.bgu.cs.bp.samplebpproject.HotCold.HotColdActuator;
import il.ac.bgu.cs.bp.samplebpproject.TicTacToe.TicTacToeGameMain;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.function.Consumer;

public class SampleDomain {
  public static final SampleDomain Chess = new SampleDomain("Chess");
  public static final SampleDomain TicTacToeWithUI = new SampleDomain("TicTacToe",
      bprog -> TicTacToeGameMain.initBProg(bprog, true), TicTacToeGameMain::initRNR);
  public static final SampleDomain TicTacToeWithoutUI = new SampleDomain("TicTacToe",
      bprog -> TicTacToeGameMain.initBProg(bprog, false), TicTacToeGameMain::initRNR);
  public static final SampleDomain EvolvedTicTacToe = new SampleDomain("TicTacToe",
      bprog -> bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy()), null);
  public static final SampleDomain HotCold = new SampleDomain("HotCold", null, rnr -> rnr.addListener(new HotColdActuator()));
  public static final SampleDomain SampleProgram = new SampleDomain("SampleProgram");

  public final String name;
  private final Consumer<BProgramRunner> rnrConsumer;
  private final Consumer<BProgram> bprogConsumer;

  private SampleDomain(String name) {
    this(name, null, null);
  }

  private SampleDomain(String name, Consumer<BProgram> bprogConsumer, Consumer<BProgramRunner> rnrConsumer) {
    this.name = name;
    this.rnrConsumer = rnrConsumer;
    this.bprogConsumer = bprogConsumer;
  }

  public void initializeBProg(BProgram bProgram) {
    if (bprogConsumer != null)
      bprogConsumer.accept(bProgram);
    bProgram.setName(this.name);
  }

  public void initializeRunner(BProgramRunner runner) {
    if (rnrConsumer != null)
      rnrConsumer.accept(runner);
  }

  public void addVerificationResources(BProgram bprog) throws IOException {
    var resource = Thread.currentThread().getContextClassLoader().getResourceAsStream(
        String.join("/", this.name, "verification.js"));
    if (resource != null) {
      bprog.appendSource(new String(resource.readAllBytes(), StandardCharsets.UTF_8));
    }
  }

  public List<String> getResourcesNames() {
    return List.of(String.join("/", this.name, "dal.js"), String.join("/", this.name, "bl.js"));
  }
}