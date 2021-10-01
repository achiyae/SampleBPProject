package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

@SuppressWarnings("serial")
public class Approaching extends IEvent {
  public static final String NAME = "A";

  public Approaching(int i) {
    super(NAME, i);
  }

  public Approaching() {
    super(NAME);
  }
}
