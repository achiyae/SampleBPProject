package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

@SuppressWarnings("serial")
public class Entering extends IEvent {
  public static final String NAME = "Entering";

  public Entering(int i) {
    super(NAME, i);
  }

  public Entering() {
    super(NAME);
  }
}
