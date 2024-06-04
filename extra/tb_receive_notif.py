from flask import Flask, request, jsonify
import threading

app = Flask(__name__)

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

def process_notification(message, client, lifetime_minute):
    """
    Function to process the content of the notification.
    """
    print('Received notification from JavaScript:')
    print('Message:', message)
    print('Client:', client)
    print('Lifetime_minute:', lifetime_minute)

@app.route('/notification', methods=['POST'])
def receive_notification():
    data = request.json
    print('Received notification from JavaScript:', data)

    # Accessing different parts of the data structure
    message = data.get('message')
    client = data.get('client')
    lifetime_minute = data.get('lifetime_minute')

    print('Received notification from JavaScript:')
    print('Message:', message)
    print('Client:', client)
    print('Lifetime_minute:', lifetime_minute)

    # Process the notification data here

    # Shut down the server
    shutdown_server()
    return jsonify({'status': 'Notification received and server shutting down'})

if __name__ == '__main__':
    # Create and start the Flask server thread
    server = threading.Thread(target=lambda: app.run(port=8000, use_reloader=False))
    server.start()

    # Wait for the Flask server thread to complete
    server.join()