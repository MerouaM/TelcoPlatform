
const axios = require('axios');
const Web3 = require('web3');

// Set up Web3 with your Ethereum node URL
//const web3 = new Web3('http://127.0.0.1:8545'); // Change to your Ethereum node URL

// Define the URL of the Python server
const pythonServerURL = 'http://localhost:8000/notification';
/*
// Contract ABI
const abi = [
  // Define the contract ABI here
];

// Contract address
const contractAddress = '0x123...'; // Replace with your contract address

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Function to retrieve TSLA details and check status
async function checkTSLAStatus(tslaId) {
  try {
      const tsla = await contract.methods.slas(tslaId).call();
      const status = tsla.status;
      return status === 'ACCEPTED' ? tsla : null;
  } catch (error) {
      console.error('Error retrieving TSLA details:', error);
      return null;
  }
}

// Mock TSLA ID (you should replace this with an actual TSLA ID)
const tslaId = 1;*/

// Data to send in the notification
const tsla = {
  status: 'Launch containers',
  duration:2,
  client: 'Client name',
};
/*
// Check TSLA status and retrieve details
checkTSLAStatus(tslaId)
    .then(tsla => {
        if (tsla) {
            // Data to send in the notification
            const notificationData = {
                message: 'TSLA Duration',
                client: tsla.client,
                duration_minute: tsla.duration, // Send TSLA duration as a notification
            };

            // Send a POST request to the Python server
            axios.post(pythonServerURL, notificationData)
                .then(response => {
                    console.log('Notification sent successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error sending notification:', error);
                });
        } else {
            console.log('TSLA is not in ACCEPTED status or not found.');
        }
    })
    .catch(error => {
        console.error('Error checking TSLA status:', error);
    });
*/

// Send a POST request to the Python server with the TSLA data
axios.post(pythonServerURL, tsla)
    .then(response => {
        console.log('Notification sent successfully:', response.data);
    })
    .catch(error => {
        console.error('Error sending notification:', error);
    });