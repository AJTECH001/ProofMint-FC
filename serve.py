#!/usr/bin/env python3
"""
Simple HTTP server for ProofMint MVP demo
Run with: python3 serve.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 ProofMint MVP Demo Server")
        print(f"📍 Serving at: http://localhost:{PORT}")
        print(f"🌐 Opening browser...")
        print(f"💡 Press Ctrl+C to stop the server")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n👋 Server stopped. Thank you for trying ProofMint MVP!")
            sys.exit(0)

if __name__ == "__main__":
    main()