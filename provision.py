"""env should be activated. 
Navigate to cli directory
    cd ../oai-cn5g-nwdaf/cli

Create a virtual environment
    python3 -m venv env
    if this command does not workm try with this one:
        python3 -m venv --system-site-packages --without-pip env

Activate the created virtual environment
source env/bin/activate

"""

import subprocess
import time
import sys
import re
import os
from termcolor import colored
from flask import Flask, request, jsonify
import threading


#-----------------------------------------------------------------SLA Duration reception----------------------------------------------------------
#This part of the code activates a Flask server to receive the rentalDuration from the SLA creation event emited by the marketplace smart contract

app = Flask(__name__)

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

def process_notification(lifetime_seconds):
    """
    Function to process the content of the notification.
    """
    print('Service duration in seconds:', lifetime_seconds)
    launch_service(lifetime_seconds)


@app.route('/notification', methods=['POST'])
def receive_notification():
    data = request.json
    rental_duration = data.get('rentalDuration', None)
    if rental_duration is not None:
        print(f"Received SLA data - Contract ID: {data['contractId']}, Rental Duration: {rental_duration}, Client: {data['client']}")
        # Send the rentalDuration to further processing
    else:
        print("Error: rentalDuration not found in the received data.")

    # Process the notification data here
    process_notification(rental_duration)
    # Shut down the server
    shutdown_server()
    return jsonify({'status': 'Notification received and server shutting down'})

#------------------------------------------------------------------Service provision--------------------------------------------------------
#This part of the code provisions an end-to-end OAI 5G network (OAI 5G federated corem OAI gnbsim and simulated OAI UE)
#and attaches it to OAI NWDAF. It launches the different docker containers using docker/docker compose

def execute_command(command):
    subprocess.run(command, shell=True, check=True)

def launch_service(lifetime_seconds):
    start_time = time.time()
    duration = lifetime_seconds
    execute_command("cd /YOUR-PATH/oai-cn5g-fed/docker-compose")
    os.chdir("/YOUR-PATH/oai-cn5g-fed/docker-compose")

    #Deploying the federated 5G core network ----------------------------------------------------------------------------------------------------

    print(colored('DEPLOYING THE 5G CORE NETWORK ......', 'red'))
    try:
        execute_command("python3 /YOUR-PATH/oai-cn5g-fed/docker-compose/core-network.py --type start-basic-vpp --scenario 1")
    except subprocess.CalledProcessError as e:
        time.sleep(15)
    time.sleep(20)


    #Deploying and launching the NWDAF containers ------------------------------------------------------------------------------------------------

    print(colored('LAUNCHING THE NWDAF CONTAINERS ......', 'red'))

    execute_command("cd /YOUR-PATH/oai-cn5g-nwdaf")
    os.chdir("/YOUR-PATH/oai-cn5g-nwdaf")
    try:
        execute_command("docker compose -f /YOUR-PATH/oai-cn5g-nwdaf/docker-compose/docker-compose-nwdaf-cn-http2.yaml up -d --force-recreate")
    except subprocess.CalledProcessError as e:
        time.sleep(2)
    time.sleep(15)
    execute_command("cd /YOUR-PATH/oai-cn5g-fed")
    os.chdir("/YOUR-PATH/oai-cn5g-fed")


    #Attaching UE using gnbsim-vpp ----------------------------------------------------------------------------------------------------------------

    print(colored('ATTACHING gNB AND UE ......','red'))

    try:
        execute_command("docker compose -f /YOUR-PATH/oai-cn5g-fed/docker-compose/docker-compose-gnbsim-vpp.yaml up -d --force-recreate")
    except subprocess.CalledProcessError as e:
        time.sleep(2)
    time.sleep(25)


    #Launching the NWDAF client ----------------------------------------------------------------------------------------------------------------------
    #Make sure to place the nwdaf-2.py file (provided in this github repository) inside the oai-cn5g-nwdaf/cli/ directory

    execute_command("cd /YOUR-PATH/oai-cn5g-nwdaf/cli")
    os.chdir("/YOUR-PATH/oai-cn5g-nwdaf/cli")

    print("STARTING NETWORK ANALYTICS ......")

    #try:
    #    execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/subscriptions/anomaly.json")
    #except subprocess.CalledProcessError as e:
    #    time.sleep(5)
    #time.sleep(5)
    #execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/subscriptions/mobility.json")
    #time.sleep(5)
    #execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-to-file.py subscribe /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/subscriptions/networkPerf_ueComm.json")

    while time.time() - start_time < float(duration):
        execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-2.py analytics /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/analytics/numPdu.json")
        time.sleep(2)
        print("executing analysis ......" + "\n")
        execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-2.py analytics /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/analytics/numUe.json")
        time.sleep(2)
        execute_command("python /YOUR-PATH/oai-cn5g-nwdaf/cli/nwdaf-2.py analytics /YOUR-PATH/oai-cn5g-nwdaf/cli/examples/analytics/ueComm.json")
        time.sleep(56)

    #Stopping containers after SLA duration expiration -----------------------------------------------------------------------------------------------------

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
    print(colored('Shutting down network analytics......', 'red'))
    time.sleep(2)

    ##Shutting down NWDAF containers

    execute_command("cd /YOUR-PATH/oai-cn5g-nwdaf")
    os.chdir("/YOUR-PATH/oai-cn5g-nwdaf")
    try:
        execute_command("docker compose -f /YOUR-PATH/oai-cn5g-nwdaf/docker-compose/docker-compose-nwdaf-cn-http2.yaml down")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    
    ##Shutting down gNB and UE containers

    print(colored('Shutting down gNB and UE......', 'red'))

    execute_command("cd /YOUR-PATH/oai-cn5g-fed")
    os.chdir("/YOUR-PATH/oai-cn5g-fed")
    try:
        execute_command("docker compose -f docker-compose/docker-compose-gnbsim-vpp.yaml down")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    ##Shutting down federated 5G core containers

    print(colored('Shutting down 5G core......', 'red'))

    execute_command("cd /YOUR-PATH/oai-cn5g-fed/docker-compose")
    os.chdir("/YOUR-PATH/oai-cn5g-fed/docker-compose")
    try:
        execute_command("python3 ./core-network.py --type stop-basic-vpp --scenario 1")
    except subprocess.CalledProcessError as e:
        time.sleep(15)

    ##Prunning docker networks and docker containers

    print(colored('CLEANING......', 'red'))

    execute_command("docker network prune")
    execute_command("docker container prune")



def main(lifetime_seconds):
    launch_service(lifetime_seconds)

if __name__ == "__main__":

    # Create and start the Flask server thread
    server = threading.Thread(target=lambda: app.run(port=8000, use_reloader=False))
    server.start()
    
    # Wait for the Flask server thread to complete
    server.join()

