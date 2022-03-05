import pygame


class InputFunc:
    def __init__(self, name, input_type, func, state=True, pass_event=False):
        self.name = name
        self.input_type = input_type
        self.func = func
        self.state = state
        self.pass_event = pass_event

    def check(self, event):
        if self.input_type == event.type:
            if self.pass_event:
                self.func(event)
            else:
                self.func()


class Looper:
    def __init__(self, name, func, state=True):
        self.name = name
        self.func = func
        self.state = state

    def run(self):
        self.func()
