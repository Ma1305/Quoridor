import socketio
from flask_socketio import send
import threading
import json


class Client:
    def __init__(self, code, server, game_graphics):
        self.client = None
        self.name = None
        self.code = code
        self.server = server
        self.game_graphics = game_graphics
        self.storage = {}

    def send(self, msg):
        msg = json.dumps(msg)
        send(msg, room=self.code)


class Sever:
    def __init__(self, ip, port, server, web_socket=None):
        self.ip = ip
        self.port = port
        self.server = server
        self.web_socket = web_socket
        self.list_of_all_clients = []
        self.server_thread = None
        self.state = False

    def run_server(self):
        if self.state:
            return self.state

        self.state = True

        # if we have sockets
        if self.web_socket:
            self.server_thread = threading.Thread(target=self.web_socket.run, args=(self.server, self.ip, self.port))
            self.server_thread.start()
            return self.state

        # if we don't have sockets
        self.server_thread = threading.Thread(target=self.server.run, args=(self.server, self.ip, self.port))
        self.server_thread.start()
        return self.state

    def send_all(self, msg):
        msg = json.dumps(msg)
        send(msg)


def get_client_by_code(client_list, code):
    for client in client_list:
        if client.code == code:
            return code
    return False
