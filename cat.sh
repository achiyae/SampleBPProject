echo ""
echo "##################################"
echo ""
squeue -lu$USER

echo ""
echo "##################################"
echo ""
jobs=($(squeue -hu$USER -o %A | paste -sd\  -))
for job in "${jobs[@]}"; do
	echo "cat \"slurm-$job.out\""
	cat "slurm-$job.out" | grep Args
done