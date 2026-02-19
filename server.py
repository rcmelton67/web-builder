from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import time
from urllib.parse import urlparse

# Ensure the data directory exists
DATA_DIR = os.path.join(os.getcwd(), 'data', 'pending-tributes')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/submit-tribute':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Create a filename based on timestamp and pet name
                timestamp = int(time.time())
                pet_name = data.get('petName', 'unknown').replace(' ', '_').lower()
                filename = f"{timestamp}_{pet_name}.json"
                filepath = os.path.join(DATA_DIR, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=4)
                
                print(f"Saved tribute to {filepath}")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Tribute saved'}).encode('utf-8'))
                
            except Exception as e:
                print(f"Error saving tribute: {e}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

def run(server_class=HTTPServer, handler_class=CustomHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    print(f"Serving files from {os.getcwd()}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    run()
