import graphics


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
        if movement["type"] == "piece move":
            if movement["movement"] == "forward":
                player.pawn.position += player.direction*17
            elif movement["movement"] == "backward":
                player.pawn.position += -1*player.direction*17
            elif movement["movement"] == "right":
                player.pawn.position += 2
            elif movement["movement"] == "backward":
                player.pawn.position -= 2
            if player.direction == 1 and player.pawn.position > 17*17:
                self.winner(player)
            elif player.direction == -1 and player.pawn.position < 0:
                self.winner(player)

        self.turn += 1
        turn = self.get_turn
        self.send_all({"command": "turn to move", "turn": turn.client.code})

    def add_player(self, player):
        player_direction = 0

        # setting up the player's pawn position
        if len(self.players) == 1:
            player.pawn.position = 9
            player_direction = 1
        if len(self.players) == 2:
            player.pawn.position = 281
            player_direction = -1

        # setting up player
        self.players.append(player)
        player.setup(self.board, player_direction)

        # starting the game
        if len(self.players) >= self.limit:
            self.start()

    def start(self):
        self.game_graphics.storage["status"] = "playing"
        nicknames = [player.nickname for player in self.players]
        self.send_all({"command": "being game", "players": nicknames})

    def send_all(self, msg):
        for player in self.players:
            player.send(msg)

    def winner(self, winner):
        self.game_graphics.storage["status"] = "over"
        self.send_all({"command": "winner", "winner": winner.client.code})


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
        msg = {"command": "setup", "board": board, "nickname": self.nickname, "direction": self.direction}
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


