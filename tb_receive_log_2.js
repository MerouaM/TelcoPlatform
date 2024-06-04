const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Web3 = require('web3');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Web3 setup
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')); // Change to your Ethereum node URL
const contractAddress = '0x9e0Cf37968F496195C1aD579030D8808dD287F34'; // Replace with your deployed contract address
const contractABI = [
    // Replace with your contract ABI
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "timestamp",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "sender",
          "type": "string"
        }
      ],
      "name": "NotificationStored",
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
      "name": "notifications",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "timestamp",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sender",
          "type": "string"
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
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_timestamp",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_sender",
          "type": "string"
        }
      ],
      "name": "storeNotification",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getNotification",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getNotificationCount",
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
    }
];

const notificationStorage = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint to receive notifications
app.post('/notification', async (req, res) => {
    const notificationData = req.body;

    console.log('Received notification:', notificationData);

    // Write the received data to a file
    const filePath = '/home/fraisier/testbed/notificationData.json';
    fs.writeFile(filePath, JSON.stringify(notificationData, null, 2), async (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Error writing to file');
            return;
        }
        console.log('Data written to file successfully');

        // Store data on the blockchain
        //const { title, content, timestamp, sender } = notificationData;
        try {
            const accounts = await web3.eth.getAccounts();
            const receipt = await notificationStorage.methods.storeNotification('title', notificationData, 'timestamp', 'sender')
                .send({ from: accounts[0] });
            console.log('Data stored on blockchain successfully', receipt);
        } catch (error) {
            console.error('Error storing data on blockchain', error);
        }

        res.status(200).send('Notification received, data written to file, and stored on blockchain');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
