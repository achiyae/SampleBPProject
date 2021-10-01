package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class FaultRaise extends BEvent {
  public static final String NAME = "FR";

  public FaultRaise() {
    super(NAME);
  }
}


