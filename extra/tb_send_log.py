import json
import requests

def send_notification():
    # URL of the JavaScript server's notification endpoint
    js_server_url = 'http://localhost:5000/notification'

    # Data content to be sent
    notification_data = {
        "title": "Test Notification",
        "content": "This is a test notification sent from the Python script.",
        "timestamp": "2024-05-14T12:34:56Z",
        "sender": "PythonScript"
    }

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

if __name__ == '__main__':
    send_notification()

