jobs=$(squeue -hu$USER -o %A | paste -sd, -)
sstat -j $jobs --allsteps --format=AveCPU,AvePages,AveRSS,AveVMSize,TRESUsageInAve,JobID
