jobs=$(squeue -hu$USER -o %A | paste -sd\  -)
echo "Cancelling jobs $jobs"
scancel $jobs
