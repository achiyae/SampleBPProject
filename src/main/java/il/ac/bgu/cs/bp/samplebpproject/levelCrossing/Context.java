package il.ac.bgu.cs.bp.samplebpproject.levelCrossing;

import il.ac.bgu.cs.bp.bpjs.model.BEvent;

@SuppressWarnings("serial")
public class Context extends BEvent {
    public boolean raised;
    public Object trainInside;

    public Context(boolean raised, Object trainInside) {
        super("Context");
        this.raised = raised;
        this.trainInside = trainInside;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + (raised ? 1231 : 1237);
        result = prime * result + ((trainInside == null) ? 0 : trainInside.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        Context other = (Context) obj;
        if (raised != other.raised)
            return false;
        if (trainInside == null) {
            if (other.trainInside != null)
                return false;
        } else if (!trainInside.equals(other.trainInside))
            return false;
        return true;
    }

    

    

}
