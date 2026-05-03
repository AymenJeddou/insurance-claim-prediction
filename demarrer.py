import sys
import time
import webbrowser
from pathlib import Path
import threading
import http.server
import socketserver
PORT = 8000
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path(__file__).parent), **kwargs)

    def log_message(self, format, *args):
        pass

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler) as httpd:
        httpd.serve_forever()
def main():
    thread = threading.Thread(target=start_server, daemon=True)
    thread.start()
    # Ouvrir l'interface
    time.sleep(0.5)
    webbrowser.open("http://localhost:8000")
    print("http://localhost:8000")
    # Boucle minimale pour garder le processus
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        return 0
    except KeyboardInterrupt:
        print("\nArret demande. Fermeture du serveur...\n")
        return 0

if __name__ == "__main__":
    sys.exit(main())
