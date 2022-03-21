import graphics
import other_calculations


class Board:
    def __init__(self, players, board, limit, game_graphics):
        self.players = players
        self.board = board
        self.limit = limit
        self.turn = 0
        self.game_graphics = game_graphics

    # check whose turn it is
    def get_turn(self):
        if self.turn == self.limit:
            self.turn = 0
        player = self.players[self.turn]
        return player

    def move(self, player, movement):
        # piece movement
        print(movement)
        if movement["type"] == "piece move":
            if movement["movement"] == "forward":
                player.pawn.position += player.direction*34
            elif movement["movement"] == "backward":
                player.pawn.position += -1*player.direction*34
            elif movement["movement"] == "right":
                player.pawn.position += player.direction*2
            elif movement["movement"] == "left":
                player.pawn.position -= player.direction*2
            elif movement["movement"] == "jump forward":
                player.pawn.position += player.direction*68
            elif movement["movement"] == "jump backward":
                player.pawn.position -= player.direction*68
            elif movement["movement"] == "jump right":
                player.pawn.position += player.direction*4
            elif movement["movement"] == "jump left":
                player.pawn.position -= player.direction*4
            elif movement["movement"] == "right top diagonal":
                player.pawn.position += player.direction*36
            elif movement["movement"] == "left top diagonal":
                player.pawn.position += player.direction*32
            elif movement["movement"] == "left down diagonal":
                player.pawn.position -= player.direction*36
            elif movement["movement"] == "right down diagonal":
                player.pawn.position -= player.direction*32
            if player.direction == 1 and player.pawn.position > 17*16:
                self.winner(player, movement)
                return True
            elif player.direction == -1 and player.pawn.position < 18:
                self.winner(player, movement)
                return True

        # fence placement
        if movement["type"] == "fence placement":
            for pos in movement["movement"]:
                self.board[pos-1] = 1
            other_player = None
            if player.board.turn == 1:
                other_player = player.board.players[0]
            else:
                other_player = player.board.players[1]
            if not other_calculations.is_path(player.pawn.position, self.board, [], player.direction) or not other_calculations.is_path(other_player.pawn.position, self.board, [], other_player.direction):
                for pos in movement["movement"]:
                    self.board[pos - 1] = 0
                player.send({"command": "invalid reply", "problem": "invalid movement"})
                return False
        # moving to the next person
        self.turn += 1
        turn = self.get_turn()
        print(player.pawn.position)
        self.print_board()
        self.send_all({"command": "moved", "player_code": player.client.code, "movement": movement})
        self.send_all({"command": "turn to move", "turn": turn.client.code})

    def add_player(self, player):
        player_direction = 0

        # setting up the player's pawn position
        if len(self.players) == 0:
            player.pawn.position = 9
            player_direction = 1
        if len(self.players) == 1:
            player.pawn.position = 281
            player_direction = -1

        # setting up player
        self.players.append(player)
        player.setup(self.board, player_direction)
        # print("how many times")

        # starting the game
        if len(self.players) >= self.limit:
            self.start()

    def start(self):
        self.game_graphics.storage["status"] = "playing"
        nicknames = [player.nickname for player in self.players]
        self.send_all({"command": "begin game", "players nickname": nicknames})
        turn = self.get_turn()
        self.send_all({"command": "turn to move", "turn": turn.client.code})

    def send_all(self, msg):
        for player in self.players:
            player.send(msg)

    def winner(self, winner, movement):
        self.send_all({"command": "moved", "player_code": winner.client.code, "movement": movement})
        self.game_graphics.storage["status"] = "over"
        self.send_all({"command": "winner", "winner": winner.client.code})
        graphics.game_graphics_list.pop(self.game_graphics)

    def print_board(self):
        counter = 0
        for unit in self.board:
            counter += 1
            print(unit, end=' ')
            if counter == 17:
                print()
                counter = 0


class Game:
    def __init__(self, board):
        self.board = board


class Pawn:
    def __init__(self, player, position):
        self.player = player
        self.position = position


class Player:
    def __init__(self, pawn, board, client, nickname):
        self.pawn = pawn
        self.board = board
        self.client = client
        self.nickname = nickname
        self.direction = None

    def send(self, msg):
        self.client.send(msg)

    def setup(self, board, direction):
        self.direction = direction
        msg = {"command": "setup", "board": board, "nickname": self.nickname, "direction": self.direction, "client code": self.client.code}
        self.send(msg)


def new_game(game_graphics):
    board_list = [0 for _ in range((9*2-1)**2)]
    board = Board([], board_list, 2, game_graphics)
    game_graphics.storage["board"] = board
    game_graphics.storage["players"] = []
    game_graphics.storage["status"] = "waiting for players"


def new_player(game_graphics, client, nickname):
    pawn = Pawn(None, 0)
    player = Player(pawn, game_graphics.storage["board"], client, nickname)
    pawn.player = player
    game_graphics.storage["board"].add_player(player)
    game_graphics.storage["players"].append(player)
    return player


