package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class ClosingRequest extends BEvent {

  public int i;

  public ClosingRequest(int i) {
    super("CR" + i);
    this.i = i;
  }

  public ClosingRequest() {
    super("CR");
    this.i = -1;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!getClass().isInstance(obj)) {
      return false;
    }
    if (i == -1) {
      return true;
    }
    ClosingRequest other = (ClosingRequest) obj;
    if (other.i == -1) {
      return true;
    }
    return i == other.i;
  }

//    @Override
//    public int compareTo(BEvent e) {
//        return this.getName().compareTo(e.getName());
//    }

  @Override
  public int hashCode() {
    String s = "ClosingRequest";
    return s.hashCode();
  }
}
