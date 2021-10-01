package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class KeepDown extends BEvent {
  public static final String NAME = "KD";

  public KeepDown(int i) {
    super(NAME, i);
  }

  public KeepDown() {
    super(NAME);
  }
}
