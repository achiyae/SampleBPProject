#!/bin/bash
#files=("lc_bp" "lc_pn" "lc_bp_faults" "lc_pn_faults")
#files=("lc_bp_faults" "lc_pn_faults")
files=("lc_bp" "lc_pn")
START=1
N=5

for file in "${files[@]}"; do
  for i in $(seq $START $N); do
    if [ $i -lt 3 ]; then
      sbatch "./job.sh" "$file $i"
    else
      if [ $i -lt 4 ]; then
        sbatch "./job.sh" "$file $i"
      fi
      sbatch "./job.sh" "$file $i 14"
      sbatch "./job.sh" "$file $i 16"
    fi
  done
done
