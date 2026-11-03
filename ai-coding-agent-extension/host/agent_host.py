import sys
import json
import struct
import subprocess
import os

# Helper function to read a message from the standard input
def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

# Helper function to send a message to the standard output
def send_message(message):
    encoded_content = json.dumps(message).encode('utf-8')
    encoded_length = struct.pack('@I', len(encoded_content))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()

def handle_command(cmd_data):
    """
    Handles terminal commands or file operations requested by the AI agent.
    """
    action = cmd_data.get('action')

    if action == 'run_command':
        command = cmd_data.get('command')
        try:
            # Note: shell=True can be dangerous if not sanitized, but this is a local agent
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            return {
                "status": "success",
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    elif action == 'read_file':
        filepath = cmd_data.get('filepath')
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            return {"status": "success", "content": content}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    # Add more actions (write_file, git_status, etc.) later
    return {"status": "error", "message": "Unknown action"}

def main():
    while True:
        try:
            # Read message from Chrome Extension
            received_message = get_message()

            # Process the message
            response = handle_command(received_message)

            # Send response back to Chrome Extension
            send_message(response)
        except Exception as e:
            send_message({"status": "error", "message": f"Host error: {str(e)}"})

if __name__ == '__main__':
    main()
