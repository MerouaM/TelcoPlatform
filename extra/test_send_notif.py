import json
import requests
import typer
from flask import Flask, request


#define send notification function



notification_data = {
    'message': 'Launch containers',
    'client': 'Client name',
    'duration_minute': 2  # Add TSLA duration here
}
# URL of the JavaScript server's notification endpoint
js_server_url = 'http://localhost:5000/notification'

try:
     # Send POST request with the notification data
    response = requests.post(js_server_url, json=notification_data)
        
    # Check response status code
    if response.status_code == 200:
        print("Notification sent to JavaScript server successfully")
    else:
        print(f"Failed to send notification to JavaScript server, status code: {response.status_code}")
        print("Response:", response.text)
except Exception as e:
    print(f"Exception occurred while sending notification: {e}")


