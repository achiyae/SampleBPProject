package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

public abstract class IEvent extends BEvent {
  public final int i;

  protected IEvent(String name, int i) {
    super(name);
    this.i = i;
  }

  protected IEvent(String name) {
    super(name);
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
    IEvent other = (IEvent) obj;
    if (other.i == -1) {
      return true;
    }
    return i == other.i;
  }

  @Override
  public int hashCode() {
    return name.hashCode();
  }

  @Override
  public String toString() {
    return i == -1 ? name : name + i;
  }
}
