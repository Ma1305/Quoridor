from networking.web_setup import *
from networking import networking
from main_folder import game as gm
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
            player = gm.new_player(game, client, "")
    if not player:
        camera = graphics.Camera(0, 0, 1, None)
        screen = graphics.Screen(500, 500)
        game = graphics.GameGraphics(screen, camera)
        camera.game_graphics = game
        gm.new_game(game)
        player = gm.new_player(game, client, "")
        games.append(game)
        game.storage["games"] = games


@web_socket.on("message")
def handel_message(message):
    client_id = request.sid
    player = None
    for game in games:
        for player_in in game.storage["players"]:
            if player_in.client.code == client_id:
                player = player_in
                break
    message = json.loads(message)
    command = message["command"]
    print(message, client_id, player.client.code)

    if command == "setup reply":
        player.nickname = message["nickname"]

    if command == "moved":
        if player.board.get_turn() == player:
            movement_type = message["movement"]["type"]
            movement = message["movement"]["movement"]
            other_player = None
            if player.board.turn == 1:
                other_player = player.board.players[0]
            else:
                other_player = player.board.players[1]
            if movement_type == "piece move":
                if player.pawn.position % 17 != 0 and movement == "right" and player.direction == 1 and player.board.board[player.pawn.position+player.direction - 1] == 0 and other_player.pawn.position != player.pawn.position+player.direction*2:
                    player.board.move(player, message["movement"])
                elif player.pawn.position % 17 != 0 and movement == "left" and player.direction == -1 and player.board.board[player.pawn.position-player.direction - 1] == 0 and other_player.pawn.position != player.pawn.position-player.direction*2:
                    player.board.move(player, message["movement"])
                elif player.pawn.position % 17 != 1 and movement == "left" and player.direction == 1 and player.board.board[player.pawn.position-player.direction - 1] == 0 and other_player.pawn.position != player.pawn.position-player.direction*2:
                    player.board.move(player, message["movement"])
                elif player.pawn.position % 17 != 1 and movement == "right" and player.direction == -1 and player.board.board[player.pawn.position+player.direction - 1] == 0 and other_player.pawn.position != player.pawn.position+player.direction*2:
                    player.board.move(player, message["movement"])
                elif movement == "forward" and player.board.board[player.pawn.position+(player.direction*17)-1] == 0 and other_player.pawn.position != player.pawn.position+player.direction*34:
                    player.board.move(player, message["movement"])
                elif movement == "backward" and player.board.board[player.pawn.position-(player.direction*17) - 1] == 0 and other_player.pawn.position != player.pawn.position-player.direction*34:
                    player.board.move(player, message["movement"])
                # jumping
                elif movement == "jump forward" and other_player.pawn.position == player.pawn.position + player.direction*34 and player.board.board[player.pawn.position + player.direction*51 - 1] == 0 and player.board.board[player.pawn.position + player.direction*17 - 1] == 0:
                    player.board.move(player, message["movement"])
                elif movement == "jump backward" and other_player.pawn.position == player.pawn.position - player.direction*34 and player.board.board[player.pawn.position - player.direction*51 - 1] == 0 and player.board.board[player.pawn.position - player.direction*17 - 1] == 0:
                    player.board.move(player, message["movement"])
                elif movement == "jump right" and other_player.pawn.position == player.pawn.position + player.direction*2 and player.board.board[player.pawn.position + player.direction*3 - 1] == 0 and player.board.board[player.pawn.position + player.direction - 1] == 0:
                    player.board.move(player, message["movement"])
                elif movement == "jump left" and other_player.pawn.position == player.pawn.position - player.direction*2 and player.board.board[player.pawn.position - player.direction*3 - 1] == 0 and player.board.board[player.pawn.position - player.direction - 1] == 0:
                    player.board.move(player, message["movement"])
                # diagonal
                elif movement == "right top diagonal" and ((player.pawn.position + player.direction*2 == other_player.pawn.position and player.board.board[player.pawn.position - player.direction*2 + player.direction*17 - 1] == 0 and player.board.board[player.pawn.position + player.direction - 1] == 0) or (player.pawn.position + player.direction*34 == other_player.pawn.position and player.board.board[player.pawn.position + player.direction*34 - player.direction - 1] == 0 and player.board.board[player.pawn.position + player.direction*17 - 1] == 0)):
                    player.board.move(player, message["movement"])
                elif movement == "left top diagonal" and ((player.pawn.position - player.direction*2 == other_player.pawn.position and player.board.board[player.pawn.position + player.direction*2 + player.direction*17 - 1] == 0 and player.board.board[player.pawn.position - player.direction - 1] == 0) or (player.pawn.position + player.direction*34 == other_player.pawn.position and player.board.board[player.pawn.position + player.direction*34 + player.direction - 1] == 0 and player.board.board[player.pawn.position + player.direction*17 - 1] == 0)):
                    player.board.move(player, message["movement"])
                elif movement == "right down diagonal" and ((player.pawn.position + player.direction*2 == other_player.pawn.position and player.board.board[player.pawn.position - player.direction*2 - player.direction*17 - 1] == 0 and player.board.board[player.pawn.position + player.direction - 1] == 0) or (player.pawn.position - player.direction*34 == other_player.pawn.position and player.board.board[player.pawn.position - player.direction*34 - player.direction - 1] == 0 and player.board.board[player.pawn.position - player.direction*17 - 1] == 0)):
                    player.board.move(player, message["movement"])
                elif movement == "left down diagonal" and ((player.pawn.position - player.direction*2 == other_player.pawn.position and player.board.board[player.pawn.position + player.direction*2 - player.direction*17 - 1] == 0 and player.board.board[player.pawn.position - player.direction - 1] == 0) or (player.pawn.position - player.direction*34 == other_player.pawn.position and player.board.board[player.pawn.position - player.direction*34 + player.direction - 1] == 0 and player.board.board[player.pawn.position - player.direction*17 - 1] == 0)):
                    player.board.move(player, message["movement"])
                else:
                    player.send({"command": "invalid reply", "problem": "invalid movement"})
            elif movement_type == "fence placement":
                if player.fences > 0:
                    wrong = False
                    corners = 0
                    movement.sort()
                    for position in movement:
                        if (((position - 1) % 17) + 1) % 2 == 1 and math.ceil(position / 17) % 2 == 1:
                            wrong = True
                            break
                        elif (((position - 1) % 17) + 1) % 2 == 0 and math.ceil(position / 17) % 2 == 0:
                            corners += 1
                        if player.board.board[position - 1] == 1:
                            wrong = True
                    if (not other_calculations.is_consecutive_number(movement, 1)) and (not other_calculations.is_consecutive_number(movement, 17)):
                        wrong = True
                    if corners > 1:
                        wrong = True
                    if wrong:
                        player.send({"command": "invalid reply", "problem": "invalid movement"})
                    else:
                        player.board.move(player, message["movement"])
                else:
                    player.send({"command": "invalid reply", "problem": "not enough fences"})

        else:
            player.send({"command": "invalid reply", "problem": "not your turn"})


@web_socket.on("disconnect")
def disconnect():
    client_id = request.sid

