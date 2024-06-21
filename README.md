# TelcoPlatform


# Project context and description

A blockchain-based platform for Telcos to provide private networks in the context of beyond-5G/6G

This project involves deploying a research initiative that proposes a blockchain-based platform to enable on-demand private 5G networks as a service. The platform has three main functions: first, it acts as a marketplace, linking network asset providers with vertical enterprises. Second, it streamlines the onboarding and integration of network assets to create customized private 5G networks. Finally, the platform ensures service compliance with users' quality of service (QoS) requirements through transparency and accountability.

It consists of three layers: the blcokchain layer, the management layer and the service layer.

The blockchain layer consists of a private blockchain network deployed on Truffle, incorporating two smart contracts (SCs) written in Solidity: Marketplace.sol and PerformanceLog.sol.

- **Marketplace.sol:** This SC handles the core functionalities of the marketplace, such as registering clients, providers, and offers, and maintaining corresponding lists. It validates SLA contracts between clients and providers, processes payments, and records established SLAs. Upon validation of an SLA, it emits an event. After the SLA expires, clients can rate the service from 1 to 5.
  
- **PerformanceLog.sol:** This SC includes a function that logs performance data to the blockchain.

The management layer comprises multiple scripts that interface between users and the blockchain layer, and between the blockchain layer and the service layer.

- **marketplace.js:** This decentralized application (dApp) is written in JavaScript using the web3.js library. It interacts with the SCs in the blockchain layer, managing the frontend for clients and providers. It enables sign-ups, offer advertisements, and service subscriptions. It sends information to the Marketplace.sol SC to register clients, providers, and offers, and to establish SLAs. Upon SLA establishment, it receives an event with contract details and forwards these to provision.py.

- **provision.py:** This Python script receives SLA details from marketplace.js and initiates the requested service by activating the necessary Docker containers (OAI 5G core, gnbsim, and UE containers) for the specified duration. It also activates the network observability module (OAI NWDAF) and periodically sends collected data to performanceLog.js. After SLA expiration, it shuts down the Docker containers.

- **performanceLog.js:** This JavaScript script, using the web3.js library, logs observability information received from provision.py to the blockchain via the PerformanceLog.sol SC.

The service layer is set up using a Docker Compose environment to deploy an OAI 5G core, which includes the main 5G core network functions (NFs), the OAI gnbsim to simulate the RAN, and a simulated UE, all as Docker containers. Additionally, the network includes an OAI NWDAF (deployed through multiple Docker containers) for capturing network analytics (e.g., number of connected UEs, PDU sessions).

# Preliminaries

**The blockchain part** 
- Truffle v5.11.5 (core: 5.11.5)
- Ganache v7.9.1
- Solidity - 0.8.21 (solc-js)
- Node v16.15.1
- Web3.js v1.10.0


**The cellular network part**
- OAI federated 5GC: https://gitlab.eurecom.fr/oai/cn5g/oai-cn5g-nwdaf/-/blob/master/docs/TUTORIAL.md?ref_type=heads
- OAI NWDAF, gnbsim, and UE: https://gitlab.eurecom.fr/oai/cn5g/oai-cn5g-fed

# Deployment

- Deploy the blockchain and cellular network parts.
- Deploy the smart contracts
- Edit the codes marketplace.js and performanceLog.js by adding the smart contract address anb ABIs.
- Update the provision.py script by filling in the path to the fedearted 5GC and NWDAF directories.

# Service launch

- Launch the provision.py script: python provision.py (make sure that the env is activated as indicated in the OAI NWDAF guide)
- Launch the performanceLog.js: node performanceLog.js
- Launch the marketplace.js script: node marketplace.js , and interact with the script to create an SLA.
- Once the SLA is created, the tesbed auto;atically launches the network services, retrieves performance data that it logs in a file and into the blockchain, and stops the service at the expiration of the SLA.

