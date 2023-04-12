import whisper
import socket
import time

model = whisper.load_model("base")

 

# Server settings
IP = "127.0.0.1"
PORT = 12346

# Create a socket object
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket to the IP and port
server_socket.bind((IP, PORT))

# Listen for incoming connections
server_socket.listen(5)

print(f"Whisper Server listening on {IP}:{PORT}")


while True:
    try:
        # Accept an incoming connection
        client_socket, client_address = server_socket.accept()
        print(f"Connection from {client_address}")

        # Receive data from the client (up to 1024 bytes)
        data = client_socket.recv(1024)
        #print(f"Received data: {data.decode('utf-8')}")
        print(f"Received data: {data}")
        #while loaded == False : 
        	#time.sleep(1)  # Sleep for 3 seconds


        # Send a response to the client
        #response = data.decode('utf-8') #m.prompt(data.decode('utf-8'))
        response = model.transcribe(  "stt/stt-mic-output.wav")['text']
        print(f"response data: {response}")

       # client_socket.send(response.encode('utf-8'))
        client_socket.send(response.encode('utf-8'))

    except Exception as e:
        print(f"Error occurred: {e}")
        error_response = f"Server error: {e}"
        client_socket.send(error_response.encode('utf-8'))

    finally:
        # Close the client socket
        try:
        	client_socket.close()
        except Exception as e:
        	print(f"Error ignore: {e}")


# Close the server socket (unreachable in this example, but included for completeness)
server_socket.close()

