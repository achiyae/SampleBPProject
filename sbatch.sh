#!/bin/bash 
#files=("lc_bp_v1" "lc_pn_check" "lc_bp_v1_faults" "lc_pn_check_faults")
files=("lc_bp" "lc_pn")
N=5

for file in "${files[@]}"; do
  for i in $(seq 1 $N); do
    if [ $i -lt 3 ]; then
      sbatch "./job.sh" "$file $i"
    elif [ $i -lt 4 ]; then
      sbatch "./job.sh" "$file $i 20"
    else
      sbatch "./job.sh" "$file $i 14"
    fi
  done
done