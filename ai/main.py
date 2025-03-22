from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  
from ollama_connection import process_message

app = Flask(__name__)
CORS(app)

@app.route('/api/ai', methods=['POST'])
def update_chat():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    message_content = data.get('content')
    chat_id = data.get('idString')
    role = data.get('role')

    # Log incoming data
    print(f"Received message: {message_content}")
    print(f"Chat ID: {chat_id}, Role: {role}")

    try:
        response_message = process_message(message_content)

        if hasattr(response_message, 'content'):  
            response_message = response_message.content

        response_data = {
            "message": response_message,
            "chat_id": chat_id,
        }

        try:
            update_payload = {
                "idString": chat_id,
                "role": "ASSISTANT",
                "content": response_message
            }
            update_response = requests.post("http://localhost:3000/api/chat/update", json=update_payload)

            if update_response.status_code != 200:
                print(f"Failed to update chat: {update_response.text}")

        except Exception as e:
            print(f"Error sending request to localhost:3000: {e}")

        return jsonify(response_data)

    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        return jsonify({"error": "Failed to process message with Ollama"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)