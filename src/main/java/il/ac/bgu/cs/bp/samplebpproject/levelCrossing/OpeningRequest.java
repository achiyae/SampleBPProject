package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

@SuppressWarnings("serial")
public class OpeningRequest extends IEvent {
  public static final String NAME = "OR";

  public OpeningRequest(int i) {
    super(NAME, i);
  }

  public OpeningRequest() {
    super(NAME);
  }
}
