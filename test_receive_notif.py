from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/notification', methods=['POST'])
def receive_notification():
    notification_data = request.json

    print('Received notification:', notification_data)
  
    content = notification_data.get('content')

    print('duration:', content.get('duration'))

    # Extract TSLA duration from notification data
  

    # Optionally, you can perform further processing or store the TSLA duration
    # For now, let's just print it

    # Return a response
    return jsonify({'message': 'Notification received'})

if __name__ == '__main__':
    app.run(port=8000)
