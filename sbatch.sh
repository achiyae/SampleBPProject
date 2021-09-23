#!/bin/bash 
#files=("lc_bp_v1" "lc_pn_check" "lc_bp_v1_faults" "lc_pn_check_faults")
files=("lc_bp_v1" "lc_pn_check")
N=4

for file in ${files[@]}; do
  for i in $(seq 1 $N); do
    if [ $i -lt 3 ]; then
      sbatch "./job.sh" "levelCrossing/$file" $i
    else
      sbatch "./job.sh" "levelCrossing/$file" $i 10
    fi
  done
done