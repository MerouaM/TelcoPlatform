// Import Web3.js
const Web3 = require('web3');

// Create a Web3 instance
let web3;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
        // Request account access if needed
        window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
        console.error("User denied account access");
    }
} else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Function to send payment
async function sendPayment(toAddress, amountInEther) {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    // Convert amount to Wei
    const amountInWei = web3.utils.toWei(amountInEther, 'ether');

    // Transaction parameters
    const transactionParameters = {
        to: toAddress, // Recipient address
        from: fromAddress, // Sender address
        value: web3.utils.toHex(amountInWei), // Amount to send in Wei
        gas: web3.utils.toHex(21000), // Gas limit (for simple transfer)
    };

    // Send the transaction
    try {
        const txHash = await web3.eth.sendTransaction(transactionParameters);
        console.log('Transaction successful with hash:', txHash);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Example usage: Replace with actual recipient address and amount
const recipientAddress = '0x97b92ce26157f6d93055c1c021f528409fe59ef4';
const amount = '0.01'; // Amount in Ether

sendPayment(recipientAddress, amount);
