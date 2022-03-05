import mathematics as math
import pygame
import copy


class GameGraphics:
    # gameGraphics is basically initializing a new game
    # if you want your game graphics to be added to the game loop you need to add it to the game graphics list
    # you can have multiple games running at the same time
    # this helps making multiple game servers
    # you can select which game graphics is your main graphics, and show it in your server side

    def __init__(self, screen, camera, background_color=(0, 0, 0)):
        self.screen = screen
        self.width = screen.screen.get_width()
        self.height = screen.screen.get_height()
        self.background_color = background_color
        self.shape_list = []
        self.on_input_list = []
        self.looper_list = []
        self.camera = camera
        self.center = (self.width/2, self.height/2)
        self.storage = {}

    def add_shape(self, shape):
        self.shape_list.append(shape)

    def insert_shape(self, index, shape):
        self.shape_list.insert(index, shape)

    def add_input_func(self, input_func):
        self.on_input_list.append(input_func)

    def insert_input_func(self, index, input_func):
        self.on_input_list.insert(index, input_func)

    def add_looper(self, looper):
        self.looper_list.append(looper)

    def insert_looper(self, index, looper):
        self.looper_list.insert(index, looper)

    def restart(self):
        self.shape_list.clear()
        self.on_input_list.clear()

    def on_input(self, event):
        for input_func in self.on_input_list:
            if input_func.state:
                input_func.check(event)

    def run_loopers(self):
        for looper in self.looper_list:
            if looper.state:
                looper.run()

    def pause_user_input(self):
        for on_input in self.on_input_list:
            on_input.state = False

    def unpause_user_input(self):
        for on_input in self.on_input_list:
            on_input.state = True

    def pause_loopers(self):
        for looper in self.looper_list:
            looper.state = False

    def unpause_loopers(self):
        for looper in self.looper_list:
            looper.state = True

    def pause(self):
        global game_graphics_list
        if self in game_graphics_list:
            game_graphics_list.remove(self)

    def start(self):
        global game_graphics_list
        if self not in game_graphics_list:
            game_graphics_list.append(self)

    def change_dimensions(self, dimensions):
        pygame.transform.scale(self.screen.screen, dimensions)

    def draw(self):
        for shape in self.shape_list:
            shape.draw()

    def draw_background(self):
        self.screen.screen.fill(self.background_color)


class Camera:
    def __init__(self, x, y, zoom, game_graphics):
        self.x = x
        self.y = y
        self.zoom = zoom
        self.game_graphics = game_graphics

    def move(self, move):
        self.x += move[0]
        self.y += move[1]

    def get_origin(self):
        center = self.game_graphics.center
        point = (-self.x, -self.y)
        point = (self.zoom*point[0], self.zoom*point[1])
        return center[0]+point[0], center[1]-point[1]

    def vr_to_real(self, point):
        origin = self.get_origin()
        point = (self.zoom*point[0], self.zoom*point[1])
        return origin[0]+point[0], origin[1]-point[1]


class Screen:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.screen = pygame.Surface((width, height))


class Object:
    def __init__(self, game_graphics, shapes):
        self.game_graphics = game_graphics
        self.shapes = shapes


class Shape:
    def __init__(self, game_graphics, shape_type):
        global types
        self.game_graphics = game_graphics
        self.shape_type = shape_type
        self.draw_func = self.shape_type.draw
        self.move_func = self.shape_type.move
        self.collide_func = self.shape_type.collider
        self.loop_functions_list = []
        if self.shape_type.loop_function:
            self.loop_functions_list.append(self.shape_type.loop_function)

    def draw(self):
        self.draw_func(self)

    def move(self, movement):
        if self.move_func:
            self.move_func(self, movement)

    def collide(self, point):
        if self.collide_func:
            return self.collide_func(self, point)

    def loop_functions(self):
        for func in self.loop_functions_list:
            func(self)


class Type:
    def __init__(self, name, draw, move=None, collider=None, loop_function=None):
        self.name = name
        self.draw = draw
        self.move = move
        self.collider = collider
        self.loop_function = loop_function


def add_type(shape_type):
    global types
    types.append(shape_type)


def add_game_graphics(game_graphics_obj):
    global game_graphics_list
    game_graphics_list.append(game_graphics_obj)


def game_graphics_copy(game_graphics, new_screen):
    s = game_graphics.screen
    game_graphics.screen = None
    new_game_graphics = copy.deepcopy(game_graphics)
    new_game_graphics.screen = new_screen

    game_graphics.screen = s
    return new_game_graphics


types = []
game_graphics_list = []

