package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

@SuppressWarnings("serial")
public class FaultEntering extends IEvent {
  public static final String NAME = "FE";

  public FaultEntering(int i) {
    super(NAME, i);
  }

  public FaultEntering() {
    super(NAME);
  }
}

