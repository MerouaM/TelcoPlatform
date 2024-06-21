const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');

// Load contract ABI and address
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "clientAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "ClientRegisteredEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "componentId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "information",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "NewComponentAddedEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "providerAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "ProviderRegisteredEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contractId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      }
    ],
    "name": "SLAContractRatedEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contractId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "componentId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rentalDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rentEndTime",
        "type": "uint256"
      }
    ],
    "name": "SlaContractsCreatedEvent",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "clientCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "componentCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "components",
    "outputs": [
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "information",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "contractCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "providerCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "slaContracts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "componentId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rentalDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentalPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentStartTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rentEndTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "registerClient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_clientAddress",
        "type": "address"
      }
    ],
    "name": "clientHasAccount",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllClients",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "registerProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_providerAddress",
        "type": "address"
      }
    ],
    "name": "providerHasAccount",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_provider",
        "type": "address"
      }
    ],
    "name": "getProviderRating",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllProviders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "information",
        "type": "string"
      }
    ],
    "name": "addComponent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_componentId",
        "type": "uint256"
      }
    ],
    "name": "getComponent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_componentId",
        "type": "uint256"
      }
    ],
    "name": "getComponentPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllComponents",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_componentId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rentalDuration",
        "type": "uint256"
      }
    ],
    "name": "rentComponent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_contractId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "_rating",
        "type": "uint8"
      }
    ],
    "name": "rateSLAContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_contractId",
        "type": "uint256"
      }
    ],
    "name": "getSLAContract",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllSLAContracts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
  
const contractAddress = '0x3AaeB2E02870Ba3eC63A9f795b8F33748a52c56C'; // Replace with your deployed contract address

// Connect to the Ethereum network (you can use Infura, Alchemy, or a local node)
const web3 = new Web3('http://localhost:9545'); // Replace with your Ethereum node URL

// Initialize contract
const marketplaceContract = new web3.eth.Contract(contractABI, contractAddress);

async function getAccounts() {
  return await web3.eth.getAccounts();
}


async function main() {
  const accounts = await getAccounts();

  // Sample accounts (Replace with actual accounts from your wallet or Ethereum node)
  const clientAccount = accounts[2]; // Replace with actual client account address
  const providerAccount = accounts[3]; // Replace with actual provider account address

  try {
    // Add a new client
   /* await marketplaceContract.methods.registerClient('ClientName').send({ from: clientAccount, gas: 200000 });
    console.log('Client registered successfully.');*/

    // Show the list of clients
    const clients = await marketplaceContract.methods.getAllClients().call();
    console.log('List of clients:', clients);

    // Add a new provider
   /* await marketplaceContract.methods.registerProvider('ProviderName').send({ from: providerAccount, gas: 200000 });
    console.log('Provider registered successfully.');*/

    // Show the list of providers
    const providers = await marketplaceContract.methods.getAllProviders().call();
    console.log('List of providers:', providers);

    // Add a new component
   /* await marketplaceContract.methods.addComponent('ComponentName', 1, 'ComponentInformation').send({ from: providerAccount , gas: 200000});
    console.log('Component added successfully.');*/

    // Show the list of components
    const components = await marketplaceContract.methods.getAllComponents().call();
    console.log('List of components:', components);

    // Create a new SLA contract
    const componentId = components[0]; // Use the first component for the SLA
    const rentalDuration = 120; // 1 hour in seconds
    const rentalPrice = await marketplaceContract.methods.getComponentPrice(componentId).call() * (rentalDuration / 60);

    console.log('SLA contract payment:', rentalPrice);

    await marketplaceContract.methods.rentComponent(componentId, rentalDuration).send({ from: clientAccount, value: rentalPrice, gas: 200000 });
    console.log('SLA contract created successfully.');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();


// Function to poll for events
async function pollForEvents() {
  try {
    const latestEvent = await marketplaceContract.getPastEvents('SlaContractsCreatedEvent', {
      fromBlock: 'latest',
      toBlock: 'latest'
    });

    if (latestEvent.length > 0) {
      const event = latestEvent[0]; // Get the latest event
      const { contractId, rentalDuration, client } = event.returnValues;
      const message = {
        contractId,
        rentalDuration,
        client
      };
      console.log('SLA contract created:', message);

      // Send the SLA details to the Python server
      try {
        await axios.post('http://localhost:8000/notification', message);
        console.log('SLA details sent to the Python server.');
      } catch (err) {
        console.error('Error sending SLA details to the Python server:', err);
      }
    }
  } catch (error) {
    console.error('Error polling for events:', error);
  }
}

// Call the pollForEvents function to start polling for events
pollForEvents();



