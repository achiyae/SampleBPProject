package il.ac.bgu.cs.bp.samplebpproject;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class NameEvent extends BEvent {

    public NameEvent(String name) {
        super(name);
    }

    @Override
    public String toString() {
        return name;
    }
}
