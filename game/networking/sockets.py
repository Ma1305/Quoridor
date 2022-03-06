from networking.web_setup import *
from networking import networking
from main_folder import game
import graphics
import user_input as ui
import json
import manager
import math
import other_calculations


games = []


@web_socket.on("connect")
def new_connection():
    client_id = request.sid
    client = networking.Client(client_id, server, None)
    player = None
    for game in games:
        if len(game.storage["players"]) < 2:
            player = game.new_player(game, client, "")
    if not player:
        camera = graphics.camera(0, 0, 1, None)
        screen = graphics.Screen(500, 500)
        game = graphics.GameGraphics(screen, camera)
        camera.game_graphics = game
        player = game.new_player(game, client, "")


@web_socket.on("message")
def handel_message(message):
    client_id = request.sid
    player = None
    for game in games:
        for player in game.storage["players"]:
            if player.client.code == client_id:
                player = player
    message = json.loads(message)
    command = message["command"]

    if command == "setup reply":
        player.nickname = message["nickname"]

    if command == "moved":
        if player.board.get_turn() == player:
            movement_type = command["type"]
            movement = command["movement"]
            other_player = None
            if player.board.turn == 1:
                other_player = player.board.players[0]
            else:
                other_player = player.board.players[1]
            if movement_type == "piece move":
                if player.pawn.position % 17 != 0 and movement == "right" and player.direction == 1:
                    player.board.move(player, movement)
                elif player.pawn.position % 17 != 0 and movement == "left" and player.direction == -1:
                    player.board.move(player, movement)
                elif player.pawn.position % 17 != 1 and movement == "left" and player.direction == 1:
                    player.board.move(player, movement)
                elif player.pawn.position % 17 != 1 and movement == "right" and player.direction == -1:
                    player.board.move(player, movement)
                elif movement == "forward" and player.borad.board[player.pawn.position+(player.direction*17)-1] == 0:
                    player.board.move(player, movement)
                elif movement == "backward" and player.borad.board[player.pawn.position-(player.direction*17) - 1] == 0:
                    player.board.move(player, movement)
                elif movement == "right" and player.borad.board[player.pawn.position+player.direction - 1] == 0:
                    player.board.move(player, movement)
                elif movement == "left" and player.borad.board[player.pawn.position-player.direction - 1] == 0:
                    player.board.move(player, movement)
                # add jump and diagonal
                elif movement == "jump forward" and other_player.pawn.position == player.pawn.position + player.direction*34:
                    player.board.move(player, movement)
                elif movement == "jump backward" and other_player.pawn.position == player.pawn.position - player.direction*34:
                    player.board.move(player, movement)
                elif movement == "jump right" and other_player.pawn.position == player.pawn.position - player.direction*2:
                    player.board.move(player, movement)
                elif movement == "jump backward" and other_player.pawn.position == player.pawn.position - player.direction*2:
                    player.board.move(player, movement)
                elif movement == "right top diagonal" and (player.pawn.position + player.direction*2 == other_player.position or player.pawn.position + player.direction*34 == other_player.position):
                    player.board.move(player, movement)
                elif movement == "left top diagonal" and (player.pawn.position - player.direction*2 == other_player.position or player.pawn.position + player.direction*34 == other_player.position):
                    player.board.move(player, movement)
                elif movement == "right down diagonal" and (player.pawn.position + player.direction*2 == other_player.position or player.pawn.position - player.direction*34 == other_player.position):
                    player.board.move(player, movement)
                elif movement == "left down diagonal" and (player.pawn.position - player.direction*2 == other_player.position or player.pawn.position - player.direction*34 == other_player.position):
                    player.board.move(player, movement)
                else:
                    player.send({"command": "invalid reply", "problem": "invalid movement"})
            elif movement_type == "fence placement":
                wrong = False
                corners = 0
                for position in movement:
                    if position % 2 == 1 and math.ceil(position/17) % 2 == 1:
                        wrong = True
                        break
                    elif not position % 2 == 1 and not math.ceil(position/17) % 2 == 1:
                        corners += 1
                if not other_calculations.is_consecutive(movement, 2) and not other_calculations.is_consecutive(movement, 17):
                    wrong = True
                if corners > 1:
                    wrong = True
                if wrong:
                    player.send({"command": "invalid reply", "problem": "invalid movement"})
                else:
                    player.board.move(player, movement)

        else:
            player.send({"command": "invalid reply", "problem": "not your turn"})


@web_socket.on("disconnect")
def disconnect():
    client_id = request.sid

