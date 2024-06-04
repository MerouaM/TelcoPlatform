const Web3 = require('web3');
const axios = require('axios');

// Set up Web3 with your Ethereum node URL
const web3 = new Web3('http://localhost:8545'); // Change to your Ethereum node URL

// Contract ABI
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum Agreement.Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "AgreementAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum Agreement.Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "AgreementStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum Agreement.Status",
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
    "name": "agreements",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "enum Agreement.Status",
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
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "enum Agreement.Status",
        "name": "_status",
        "type": "uint8"
      }
    ],
    "name": "storeAgreement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
      },
      {
        "internalType": "enum Agreement.Status",
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
const contractAddress = '0xb792Cf7332b516f9A884d2f5C5b41821C1333d99'; // Replace with your contract address

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Mock agreement data
const agreementData = {
  duration: 2, // 2 minutes
  status: 2 // accepted
};

// Function to simulate the passage of time
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to start the agreement with status Pending and change it to Accepted after 1 minute
async function startAgreement() {
  try {
      // Store the initial agreement with status Pending
      const receiptStore = await contract.methods.storeAgreement(agreementData.duration, agreementData.status).send({ from: '0xCD0EDF590B8071d86EFdeE78713D9e1d6ddad4D4' }); // Replace with your Ethereum node URL
      console.log('Agreement started successfully with status Pending:', receiptStore);
      console.log('Receipt:', receiptStore);
      console.log('end');

      // Extract the agreementId from the receipt
      //const agreementId = receiptStore.events.AgreementStored.returnValues.agreementId;
      //console.log('Receipt:', agreementId);
      // Simulate waiting for one minute
      //console.log('Waiting for one minute...');
      //await sleep(60000); // 1 minute in milliseconds

      // Get the stored event logs
      /*const logs = await contract.getPastEvents('StatusChanged', {
          filter: { agreementId: agreementId },
          fromBlock: 0,
          toBlock: 'latest'
      });*/

      // Find the log that represents the change to 'Accepted'
      //const acceptedLog = logs.find(log => log.returnValues.newStatus === 2);

      // Check if the log is found
      /*if (acceptedLog) {
          console.log('Agreement status changed to Accepted successfully');
      } else {
          throw new Error('Agreement status change to Accepted not found in event logs');
      }*/

      // Send a notification with agreement data
      const notificationData = {
          message: 'Agreement Data',
          content: agreementData
      };
      await axios.post('http://localhost:8000/notification', notificationData);
      console.log('Notification sent successfully:', notificationData);
  } catch (error) {
      console.error('Error:', error);
  }
}

// Start the agreement process
startAgreement();