const Web3 = require('web3');
const axios = require('axios');

// Set up Web3 with your Ethereum node URL
const web3 = new Web3('http://localhost:8545'); // Change to your Ethereum node URL

// Contract ABI
const abi = [
    // Define the contract ABI here
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "slaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum SLA.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "name": "SLAAccepted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "slaId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startingTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum SLA.Status",
          "name": "status",
          "type": "uint8"
        }
      ],
      "name": "SLAStored",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "slaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum SLA.Status",
          "name": "newStatus",
          "type": "uint8"
        }
      ],
      "name": "StatusChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "slas",
      "outputs": [
        {
          "internalType": "address",
          "name": "client",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startingTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "enum SLA.Status",
          "name": "status",
          "type": "uint8"
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
          "name": "_client",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_startingTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        },
        {
          "internalType": "enum SLA.Status",
          "name": "_status",
          "type": "uint8"
        }
      ],
      "name": "storeSLA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_slaId",
          "type": "uint256"
        },
        {
          "internalType": "enum SLA.Status",
          "name": "_newStatus",
          "type": "uint8"
        }
      ],
      "name": "changeStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

// Contract address
const contractAddress = '0x97b92ce26157f6d93055c1c021f528409fe59ef4'; // Replace with your contract address

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Mock SLA data
const slaData = {
    client: 'Meroua', // To be filled later with an actual Ethereum address
    duration: 120, // 2 minutes in seconds
    startingTime: Math.floor(Date.now() / 1000), // Current UNIX timestamp
    endTime: 0, // Will be calculated later
    status: 0 // 'Pending' status (enum value 0)
};

// Function to simulate the passage of time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to start the SLA with status Pending and change it to Accepted after 2 minutes
async function startSLA() {
  try {
      // Get the list of accounts
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0]; // Use the first account

      // Set the client address to the first account
      slaData.client = account;

      // Store the initial SLA with status Pending
      const receipt = await contract.methods.storeSLA(
          slaData.client, slaData.duration, slaData.startingTime, slaData.endTime, slaData.status
      ).send({ from: account });
      console.log('SLA started successfully with status Pending:', receipt);

      // Log the entire receipt for debugging purposes
      console.log('Transaction receipt:', JSON.stringify(receipt, null, 2));

      // Check if the SLAStored event is present
      if (!receipt.events || !receipt.events.SLAStored) {
          throw new Error('SLAStored event not found in receipt');
      }

      // Extract the event information from the receipt
      const slaStoredEvent = receipt.events.SLAStored;
      console.log('SLAStored event:', slaStoredEvent);

      // Get the SLA ID from the event
      const slaId = slaStoredEvent.returnValues.slaId;

      // Simulate waiting for two minutes
      console.log('Waiting for two minutes...');
      await sleep(120000); // 2 minutes in milliseconds

      // Change SLA status to Accepted
      slaData.status = 2; // 'Accepted' status (enum value 2)
      const statusChangeReceipt = await contract.methods.changeStatus(slaId, slaData.status).send({ from: account });
      console.log('SLA status changed to Accepted successfully:', statusChangeReceipt);

      // Send a notification with SLA data
      const notificationData = {
          message: 'SLA Data',
          content: slaData
      };
      await axios.post('http://localhost:8000/notification', notificationData);
      console.log('Notification sent successfully:', notificationData);
  } catch (error) {
      console.error('Error:', error);
  }
}

// Start the SLA process
startSLA();