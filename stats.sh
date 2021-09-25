echo ""
echo "##################################"
echo ""
squeue -lu$USER

echo ""
echo "##################################"
echo ""
jobs=$(squeue -hu$USER -o %A | paste -sd, -)
sstat -j $jobs --allsteps --format=JobID,AveCPU,AvePages,AveRSS,AveVMSize,TRESUsageInAve

echo ""
echo "##################################"
echo ""

sacct --format=JobID,JobName,AveRSS,MaxRSS,AvePages,MaxPages,State,Elapsed,ResvCPU,CPUTime,Start,ExitCode,DerivedExitcode,Comment