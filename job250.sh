#!/bin/bash 
### sbatch config parameters must start with #SBATCH and must precede any other command. to ignore just add another # - like so ##SBATCH
#SBATCH --partition main ### specify partition name where to run a job
##SBATCH --time 1-00:00:00 ### limit the time of job running. Format: D-H:MM:SS
#SBATCH --job-name sel_verification ### name of the job. replace my_job with your desired job name
## no need to redirect out and err to different files. By default they are redirected to slurm-%j.out
##SBATCH --output my_job-id-%J.out ### output log for running job - %J is the job number variable
##SBATCH --error my_job-id-%J.err ### output log for running job - %J is the job number variable
#SBATCH --mail-user=achiya@bgu.ac.il ### users email for sending job status notifications – replace with yours
#SBATCH --mail-type=BEGIN,END,FAIL ### conditions when to send the email. ALL,BEGIN,END,FAIL, REQUEU, NONE
#SBATCH --mem=250G ### total amount of RAM // 500
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=56 ##. // max 128

### Start you code below ####
module load anaconda ### load anaconda module
source activate selenium ### activating Conda environment. Environment must be configured before running the job
cd ~/repos/SampleBPProject/ || exit
export MAVEN_OPTS="-Xms250g -Xmx250g"
mvn compile > /dev/null 2>&1
mvn exec:java -D"exec.args"="$@"
