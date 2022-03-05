import pygame


class GameLoop:
    def __init__(self):
        self.fps = 40
        self.clock = None
        self.screen = None
        self.screen_width = None
        self.screen_height = None
        self.main_game_graphics = None
        self.events = []
        self.server = None
        self.server_user_input = []
        self.server_loopers = []

    def make_screen(self, width, height):
        self.screen_width = width
        self.screen_height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.update()

    def set_main_game_graphics(self, game_graphics):
        self.main_game_graphics = game_graphics

    def turn_to_server(self, server):
        self.server = server

    def run_server_loopers(self):
        for looper in self.server_loopers:
            if looper.state:
                looper.run()

    def on_input(self, event):
        for input_func in self.server_user_input:
            if input_func.state:
                input_func.check(event)


game_loop = GameLoop()

