package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class OpeningRequest extends BEvent{

    public int i;

    public OpeningRequest(int i){
        super("OpeningRequest"+i);
        this.i = i;
    }

    public OpeningRequest(){
        super("OpeningRequest");
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
        OpeningRequest other = (OpeningRequest) obj;
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
        String s = "OpeningRequest";
        return s.hashCode();
    }
}
