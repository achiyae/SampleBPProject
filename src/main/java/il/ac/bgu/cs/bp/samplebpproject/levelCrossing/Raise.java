package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class Raise extends BEvent {
  public static final String NAME = "R";

  public Raise() {
    super(NAME);
  }
}
