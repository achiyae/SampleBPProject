importPackage(Packages.il.ac.bgu.cs.bp.samplebpproject)

bp.registerBThread("fork1", function() {
    var fork1 = 1;
    while (true){
        if(fork1 < 1){
            bp.sync({waitFor: [NameEvent("putRightFork1"), NameEvent("putLeftFork2")],
                block:[NameEvent("takeRightFork1"), NameEvent("takeLeftFork2")]});
            fork1 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putRightFork1"), NameEvent("putLeftFork2"),
                    NameEvent("takeRightFork1"), NameEvent("takeLeftFork2")]}).name.startsWith("take")){
                fork1 -= 1;
            } else {
                fork1 += 1;
            }
        }
    }
});

bp.registerBThread("fork2", function() {
    var fork2 = 1;
    while (true){
        if(fork2 < 1){
            bp.sync({waitFor: [NameEvent("putLeftFork1"), NameEvent("putRightFork2")],
                block:[NameEvent("takeLeftFork1"), NameEvent("takeRightFork2")]});
            fork2 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putLeftFork1"), NameEvent("putRightFork2"),
                    NameEvent("takeLeftFork1"), NameEvent("takeRightFork2")]}).name.startsWith("take")){
                fork2 -= 1;
            } else {
                fork2 += 1;
            }
        }
    }
});

bp.registerBThread("p11", function() {
    var p11 = 1;
    while (true){
        if(p11 < 1){
            bp.sync({waitFor: NameEvent("putRightFork1"), block:NameEvent("takeRightFork1")});
            p11 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putRightFork1"), NameEvent("takeRightFork1")]}).name.startsWith("take")){
                p11 -= 1;
            } else {
                p11 += 1;
            }
        }
    }
});

bp.registerBThread("p12", function() {
    var p12 = 0;
    while (true){
        if(p12 < 1){
            bp.sync({waitFor: NameEvent("startThinking1"), block:NameEvent("putRightFork1")});
            p12 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking1"), NameEvent("putRightFork1")]}).name.startsWith("put")){
                p12 -= 1;
            } else {
                p12 += 1;
            }
        }
    }
});

bp.registerBThread("p13", function() {
    var p13 = 1;
    while (true){
        if(p13 < 1){
            bp.sync({waitFor: NameEvent("startThinking1"), block:NameEvent("startEating1")});
            p13 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking1"), NameEvent("startEating1")]}).name.startsWith("startEating")){
                p13 -= 1;
            } else {
                p13 += 1;
            }
        }
    }
});

bp.registerBThread("p14", function() {
    var p14 = 0;
    while (true){
        if(p14 < 1){
            bp.sync({waitFor: NameEvent("takeRightFork1"), block:NameEvent("startEating1")});
            p14 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("takeRightFork1"), NameEvent("startEating1")]}).name.startsWith("startEating")){
                p14 -= 1;
            } else {
                p14 += 1;
            }
        }
    }
});

bp.registerBThread("p15", function() {
    var p15 = 0;
    while (true){
        if(p15 < 1){
            bp.sync({waitFor: NameEvent("startThinking1"), block:NameEvent("putLeftFork1")});
            p15 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking1"), NameEvent("putLeftFork1")]}).name.startsWith("putLeftFork")){
                p15 -= 1;
            } else {
                p15 += 1;
            }
        }
    }
});

bp.registerBThread("p16", function() {
    var p16 = 0;
    while (true){
        if(p16 < 1){
            bp.sync({waitFor: NameEvent("startEating1"), block:NameEvent("startThinking1")});
            p16 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startEating1"), NameEvent("startThinking1")]}).name.startsWith("startThinking")){
                p16 -= 1;
            } else {
                p16 += 1;
            }
        }
    }
});

bp.registerBThread("p17", function() {
    var p17 = 0;
    while (true){
        if(p17 < 1){
            bp.sync({waitFor: NameEvent("takeLeftFork1"), block:NameEvent("startEating1")});
            p17 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("takeLeftFork1"), NameEvent("startEating1")]}).name.startsWith("startEating")){
                p17 -= 1;
            } else {
                p17 += 1;
            }
        }
    }
});

bp.registerBThread("p18", function() {
    var p18 = 1;
    while (true){
        if(p18 < 1){
            bp.sync({waitFor: NameEvent("putLeftFork1"), block:NameEvent("takeLeftFork1")});
            p18 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putLeftFork1"), NameEvent("takeLeftFork1")]}).name.startsWith("take")){
                p18 -= 1;
            } else {
                p18 += 1;
            }
        }
    }
});

bp.registerBThread("p21", function() {
    var p21 = 1;
    while (true){
        if(p21 < 1){
            bp.sync({waitFor: NameEvent("putLeftFork2"), block:NameEvent("takeLeftFork2")});
            p21 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putLeftFork2"), NameEvent("takeLeftFork2")]}).name.startsWith("take")){
                p21 -= 1;
            } else {
                p21 += 1;
            }
        }
    }
});

bp.registerBThread("p22", function() {
    var p22 = 0;
    while (true){
        if(p22 < 1){
            bp.sync({waitFor: NameEvent("takeLeftFork2"), block:NameEvent("startEating2")});
            p22 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("takeLeftFork2"), NameEvent("startEating2")]}).name.startsWith("startEating")){
                p22 -= 1;
            } else {
                p22 += 1;
            }
        }
    }
});

bp.registerBThread("p23", function() {
    var p23 = 0;
    while (true){
        if(p23 < 1){
            bp.sync({waitFor: NameEvent("startEating2"), block:NameEvent("startThinking2")});
            p23 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startEating2"), NameEvent("startThinking2")]}).name.startsWith("startThinking")){
                p23 -= 1;
            } else {
                p23 += 1;
            }
        }
    }
});

bp.registerBThread("p24", function() {
    var p24 = 0;
    while (true){
        if(p24 < 1){
            bp.sync({waitFor: NameEvent("startThinking2"), block:NameEvent("putLeftFork2")});
            p24 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking2"), NameEvent("putLeftFork2")]}).name.startsWith("putLeftFork")){
                p24 -= 1;
            } else {
                p24 += 1;
            }
        }
    }
});

bp.registerBThread("p25", function() {
    var p25 = 0;
    while (true){
        if(p25 < 1){
            bp.sync({waitFor: NameEvent("takeRightFork2"), block:NameEvent("startEating2")});
            p25 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("takeRightFork2"), NameEvent("startEating2")]}).name.startsWith("startEating")){
                p25 -= 1;
            } else {
                p25 += 1;
            }
        }
    }
});

bp.registerBThread("p26", function() {
    var p26 = 1;
    while (true){
        if(p26 < 1){
            bp.sync({waitFor: NameEvent("startThinking2"), block:NameEvent("startEating2")});
            p26 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking2"), NameEvent("startEating2")]}).name.startsWith("startEating")){
                p26 -= 1;
            } else {
                p26 += 1;
            }
        }
    }
});

bp.registerBThread("p27", function() {
    var p27 = 0;
    while (true){
        if(p27 < 1){
            bp.sync({waitFor: NameEvent("startThinking2"), block:NameEvent("putRightFork2")});
            p27 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("startThinking2"), NameEvent("putRightFork2")]}).name.startsWith("put")){
                p27 -= 1;
            } else {
                p27 += 1;
            }
        }
    }
});

bp.registerBThread("p28", function() {
    var p28 = 1;
    while (true){
        if(p28 < 1){
            bp.sync({waitFor: NameEvent("putRightFork2"), block:NameEvent("takeRightFork2")});
            p28 += 1;
        } else {
            if (bp.sync({waitFor: [NameEvent("putRightFork2"), NameEvent("takeRightFork2")]}).name.startsWith("take")){
                p28 -= 1;
            } else {
                p28 += 1;
            }
        }
    }
});

bp.registerBThread("phelper", function() {
    while (true){
        bp.sync({request: [NameEvent("putRightFork1"),
                NameEvent("takeRightFork1"),
                NameEvent("startThinking1"),
                NameEvent("startEating1"),
                NameEvent("putLeftFork1"),
                NameEvent("takeLeftFork1"),
                NameEvent("putRightFork2"),
                NameEvent("takeRightFork2"),
                NameEvent("startThinking2"),
                NameEvent("startEating2"),
                NameEvent("putLeftFork2"),
                NameEvent("takeLeftFork2")]});
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