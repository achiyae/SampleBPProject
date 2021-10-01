#!/bin/bash 
#files=("lc_bp" "lc_pn" "lc_bp_faults" "lc_pn_faults")
#files=("lc_bp_faults" "lc_pn_faults")
files=("lc_bp" "lc_pn")
N=5
START=1

for file in "${files[@]}"; do
  for i in $(seq $START $N); do
    if [ $i -lt 3 ]; then
      sbatch "./job.sh" "$file $i"
    else
      sbatch "./job.sh" "$file $i 14"
    fi
  done
done