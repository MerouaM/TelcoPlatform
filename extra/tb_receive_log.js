const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive notifications
app.post('/notification', (req, res) => {
    const notificationData = req.body;

    console.log('Received notification:', notificationData);

    // Write the received data to a file
    const filePath = '/home/fraisier/testbed/notificationData.json';
    fs.writeFile(filePath, JSON.stringify(notificationData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Error writing to file');
            return;
        }
        console.log('Data written to file successfully');
        res.status(200).send('Notification received and data written to file');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
