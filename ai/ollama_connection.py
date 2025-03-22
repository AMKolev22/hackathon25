from ollama import Client

client = Client(
    host='https://a332-84-238-167-232.ngrok-free.app/', 
    headers={'x-some-header': 'some-value'}
)

def process_message( message_content):

    try:
        response = client.chat(model='llama3.2-vision', messages=[
            {
                'role': 'user',
                'content': message_content,
            },
        ])
        
        if response:
            response_message = response.get('message', 'No response from Ollama')
        else:
            response_message = 'No response from Ollama'
        
        print (response_message)
        
        return response_message
    
    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        raise 
