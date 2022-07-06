importPackage(Packages.il.ac.bgu.cs.bp.samplebpproject)

bp.registerBThread("init", function() {
    var init = 1;
    while (true){
        if(init < 1){
            bp.sync({block:NameEvent("begin")});
            init += 1;
        } else {
            bp.sync({waitFor: NameEvent("begin")});
            init -= 1;
        }
    }
});
bp.registerBThread("turnX", function() {
    var turnX = 0;
    while (true){
        if(turnX < 1){
            bp.sync({waitFor: [NameEvent("begin"),NameEvent("O,0,0"),NameEvent("O,0,1"),NameEvent("O,0,2"),
                    NameEvent("O,1,0"),NameEvent("O,1,1"),NameEvent("O,1,2"),
                    NameEvent("O,2,0"),NameEvent("O,2,1"),NameEvent("O,2,2")],
                block:[NameEvent("X,0,0"),NameEvent("X,0,1"),NameEvent("X,0,2"),
                    NameEvent("X,1,0"),NameEvent("X,1,1"),NameEvent("X,1,2"),
                    NameEvent("X,2,0"),NameEvent("X,2,1"),NameEvent("X,2,2")]});
            turnX += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("begin"),NameEvent("O,0,0"),NameEvent("O,0,1"),NameEvent("O,0,2"),
                    NameEvent("O,1,0"),NameEvent("O,1,1"),NameEvent("O,1,2"),
                    NameEvent("O,2,0"),NameEvent("O,2,1"),NameEvent("O,2,2"),
                    NameEvent("X,0,0"),NameEvent("X,0,1"),NameEvent("X,0,2"),
                    NameEvent("X,1,0"),NameEvent("X,1,1"),NameEvent("X,1,2"),
                    NameEvent("X,2,0"),NameEvent("X,2,1"),NameEvent("X,2,2")]}).name.startsWith("X")){
                turnX -= 1;
            } else {
                turnX += 1;
            }
        }
    }
});

bp.registerBThread("turnO", function() {
    var turnX = 0;
    while (true){
        if(turnX < 1){
            bp.sync({waitFor: [NameEvent("X,0,0"),NameEvent("X,0,1"),NameEvent("X,0,2"),
                    NameEvent("X,1,0"),NameEvent("X,1,1"),NameEvent("X,1,2"),
                    NameEvent("X,2,0"),NameEvent("X,2,1"),NameEvent("X,2,2")],
                block:[NameEvent("O,0,0"),NameEvent("O,0,1"),NameEvent("O,0,2"),
                    NameEvent("O,1,0"),NameEvent("O,1,1"),NameEvent("O,1,2"),
                    NameEvent("O,2,0"),NameEvent("O,2,1"),NameEvent("O,2,2")]});
            turnX += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("begin"),NameEvent("O,0,0"),NameEvent("O,0,1"),NameEvent("O,0,2"),
                    NameEvent("O,1,0"),NameEvent("O,1,1"),NameEvent("O,1,2"),
                    NameEvent("O,2,0"),NameEvent("O,2,1"),NameEvent("O,2,2"),
                    NameEvent("X,0,0"),NameEvent("X,0,1"),NameEvent("X,0,2"),
                    NameEvent("X,1,0"),NameEvent("X,1,1"),NameEvent("X,1,2"),
                    NameEvent("X,2,0"),NameEvent("X,2,1"),NameEvent("X,2,2")]}).name.startsWith("O")){
                turnX -= 1;
            } else {
                turnX += 1;
            }
        }
    }
});

bp.registerBThread("0,0", function() {
    var t00 = 1;
    while (true){
        if(t00 < 1){
            bp.sync({block:[NameEvent("X,0,0"), NameEvent("O,0,0")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,0,0"), NameEvent("O,0,0")]});
            t00 -= 1;
        }
    }
});

bp.registerBThread("0,1", function() {
    var t01 = 1;
    while (true){
        if(t01 < 1){
            bp.sync({block:[NameEvent("X,0,1"), NameEvent("O,0,1")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,0,1"), NameEvent("O,0,1")]});
            t01 -= 1;
        }
    }
});

bp.registerBThread("0,2", function() {
    var t02 = 1;
    while (true){
        if(t02 < 1){
            bp.sync({block:[NameEvent("X,0,2"), NameEvent("O,0,2")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,0,2"), NameEvent("O,0,2")]});
            t02 -= 1;
        }
    }
});

bp.registerBThread("1,0", function() {
    var t10 = 1;
    while (true){
        if(t10 < 1){
            bp.sync({block:[NameEvent("X,1,0"), NameEvent("O,1,0")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,1,0"), NameEvent("O,1,0")]});
            t10 -= 1;
        }
    }
});

bp.registerBThread("1,1", function() {
    var t11 = 1;
    while (true){
        if(t11 < 1){
            bp.sync({block:[NameEvent("X,1,1"), NameEvent("O,1,1")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,1,1"), NameEvent("O,1,1")]});
            t11 -= 1;
        }
    }
});

bp.registerBThread("1,2", function() {
    var t12 = 1;
    while (true){
        if(t12 < 1){
            bp.sync({block:[NameEvent("X,1,2"), NameEvent("O,1,2")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,1,2"), NameEvent("O,1,2")]});
            t12 -= 1;
        }
    }
});

bp.registerBThread("2,0", function() {
    var t20 = 1;
    while (true){
        if(t20 < 1){
            bp.sync({block:[NameEvent("X,2,0"), NameEvent("O,2,0")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,2,0"), NameEvent("O,2,0")]});
            t20 -= 1;
        }
    }
});

bp.registerBThread("2,1", function() {
    var t21 = 1;
    while (true){
        if(t21 < 1){
            bp.sync({block:[NameEvent("X,2,1"), NameEvent("O,2,1")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,2,1"), NameEvent("O,2,1")]});
            t21 -= 1;
        }
    }
});

bp.registerBThread("2,2", function() {
    var t22 = 1;
    while (true){
        if(t22 < 1){
            bp.sync({block:[NameEvent("X,2,2"), NameEvent("O,2,2")]});
        } else {
            bp.sync({waitFor: [NameEvent("X,2,2"), NameEvent("O,2,2")]});
            t22 -= 1;
        }
    }
});

bp.registerBThread("phelper", function() {
    while (true){
        bp.sync({request: [NameEvent("begin"),NameEvent("O,0,0"),NameEvent("O,0,1"),NameEvent("O,0,2"),
                NameEvent("O,1,0"),NameEvent("O,1,1"),NameEvent("O,1,2"),
                NameEvent("O,2,0"),NameEvent("O,2,1"),NameEvent("O,2,2"),
                NameEvent("X,0,0"),NameEvent("X,0,1"),NameEvent("X,0,2"),
                NameEvent("X,1,0"),NameEvent("X,1,1"),NameEvent("X,1,2"),
                NameEvent("X,2,0"),NameEvent("X,2,1"),NameEvent("X,2,2")]});
    }
});

bp.registerBThread('mark state as accepting', function () {
    while (true) {
        if (use_accepting_states) {
            AcceptingState.Continuing()
            // AcceptingState.Stopping()
        }
        bp.sync({ waitFor: bp.all })
    }
})