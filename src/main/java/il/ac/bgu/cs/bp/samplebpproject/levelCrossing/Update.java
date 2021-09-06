package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

import java.util.Set;

@SuppressWarnings("serial")
public class Update extends BEvent {

    public Set<BEvent> requestedAndNotBlockedSystem2;

    public Update(){
        super("Update");
    }

}
