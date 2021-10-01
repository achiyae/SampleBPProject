package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

@SuppressWarnings("serial")
public class Leaving extends IEvent {
  public static final String NAME = "Le";

  public Leaving(int i) {
    super(NAME, i);
  }

  public Leaving() {
    super(NAME);
  }
}
