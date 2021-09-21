#!/bin/bash 
#files=("lc_bp_v1" "lc_pn_check" "lc_bp_v1_faults" "lc_pn_check_faults")
files=("lc_bp_v1")
N=6

for file in ${files[@]}; do
  for i in $(seq 1 $N); do
    sbatch "./job.sh" "levelCrossing/$file" $i
  done
done