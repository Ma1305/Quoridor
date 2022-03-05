from networking.web_setup import *
from networking import networking
import main_folder.game as game
import graphics
import user_input as ui
import json
import manager


@web_socket.on("connect")
def new_connection():
    client_id = request.sid
    client = networking.Client(client_id, server, None)
    


@web_socket.on("message")
def handel_message(message):
    message = json.loads(message)
    command = message["command"]
