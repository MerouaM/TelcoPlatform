"""env should be activated"""
import subprocess
import time
import sys
import re
import os
from termcolor import colored

def execute_command(command):
    subprocess.run(command, shell=True, check=True)

def launch_service(lifetime_minute):
    start_time = time.time()
    duration = lifetime_minute*60
    execute_command("cd /home/fraisier/.5gfed/oai-cn5g-fed/docker-compose")
    os.chdir("/home/fraisier/.5gfed/oai-cn5g-fed/docker-compose")
    print("Current directory:", os.getcwd())
    #Deploying the network core
    print(colored('DEPLOYING THE 5G CORE NETWORK ......', 'red'))
    try:
        execute_command("python3 /home/fraisier/.5gfed/oai-cn5g-fed/docker-compose/core-network.py --type start-basic-vpp --scenario 1")
    except subprocess.CalledProcessError as e:
        time.sleep(15)
        print("I am in exception")
    time.sleep(20)
    print("I out of exception__________________________________")
    #launch NWDAF containers
    print(colored('LAUNCHING THE NWDAF CONTAINERS ......', 'red'))

    execute_command("cd /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf")
    os.chdir("/home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf")
    try:
        execute_command("docker compose -f /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/docker-compose/docker-compose-nwdaf-cn-http2.yaml up -d --force-recreate")
    except subprocess.CalledProcessError as e:
        time.sleep(2)
    time.sleep(15)
    execute_command("cd /home/fraisier/.5gfed/oai-cn5g-fed")
    os.chdir("/home/fraisier/.5gfed/oai-cn5g-fed")
    #Attaching UE using gnbsim-vpp
    print(colored('ATTACHING gNB AND UE ......','red'))

    try:
        execute_command("docker compose -f /home/fraisier/.5gfed/oai-cn5g-fed/docker-compose/docker-compose-gnbsim-vpp.yaml up -d --force-recreate")
    except subprocess.CalledProcessError as e:
        time.sleep(2)
    time.sleep(25)


    #Launch the NWDAF client

    execute_command("cd /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli")
    os.chdir("/home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli")
    print("Current directory:", os.getcwd())

    print("STARTING NETWORK ANALYTICS ......")

    #try:
    #    execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/subscriptions/anomaly.json")
    #except subprocess.CalledProcessError as e:
    #    time.sleep(5)
    #time.sleep(5)
    #execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/subscriptions/mobility.json")
    #time.sleep(5)
    #execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/subscriptions/networkPerf_ueComm.json")

    while time.time() - start_time < duration:
        execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py analytics /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/analytics/numPdu.json")
        time.sleep(2)
        print("executing analysis ......" + "\n")
        execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py analytics /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/analytics/numUe.json")
        time.sleep(2)
        execute_command("python /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/nwdaf-to-file.py analytics /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/cli/examples/analytics/ueComm.json")
        time.sleep(56)
    #stop containers
    print("STOPPING NETWORK ANALYTICS ......" + "\n" )
    time.sleep(10)
    print(colored('Shutting down containers in 5 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down containers in 4 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down containers in 3 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down containers in 2 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down containers in 1 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down containers in 0 seconds ......', 'red'))
    time.sleep(1)
    print(colored('Shutting down ......', 'red'))
    time.sleep(1)

    print(colored('Shutting down analytics......', 'red'))
    time.sleep(2)

    execute_command("cd /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf")
    os.chdir("/home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf")
    try:
        execute_command("docker compose -f /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/docker-compose/docker-compose-nwdaf-cn-http2.yaml down")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    #execute_command("docker compose -f /home/fraisier/.5g-f1-nwdaf/oai-cn5g-nwdaf/docker-compose/docker-compose-nwdaf-cn-http2.yaml down")

    print(colored('Shutting down gNB and UE......', 'red'))

    execute_command("cd /home/fraisier/.5gfed/oai-cn5g-fed")
    os.chdir("/home/fraisier/.5gfed/oai-cn5g-fed")
    try:
        execute_command("docker compose -f docker-compose/docker-compose-gnbsim-vpp.yaml down")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    #execute_command("docker compose -f docker-compose/docker-compose-gnbsim-vpp.yaml down")

    print(colored('Shutting down 5G core......', 'red'))

    execute_command("cd /home/fraisier/.5gfed/oai-cn5g-fed/docker-compose")
    os.chdir("/home/fraisier/.5gfed/oai-cn5g-fed/docker-compose")
    try:
        execute_command("python3 ./core-network.py --type stop-basic-vpp --scenario 1")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    #execute_command("python3 ./core-network.py --type stop-basic-vpp --scenario 1")

    print(colored('CLEANING......', 'red'))

    execute_command("docker network prune")
    execute_command("docker container prune")




def main(lifetime_minute):
    launch_service(lifetime_minute)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 script.py <duration_in_minutes>")
        sys.exit(1)
    lifetime_minute = int(sys.argv[1])
    main(lifetime_minute)
