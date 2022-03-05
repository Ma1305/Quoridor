import pygame
from main_folder import main
import graphics as graphics
import manager as manager

clock = manager.game_loop.clock = pygame.time.Clock()


while True:
    # drawing graphics
    '''for game_graphics in graphics.game_graphics_list:
        game_graphics.draw_background()
        game_graphics.draw()'''
    if manager.game_loop.main_game_graphics:

        manager.game_loop.main_game_graphics.draw_background()
        manager.game_loop.main_game_graphics.draw()

        manager.game_loop.screen.blit(manager.game_loop.main_game_graphics.screen.screen, (0, 0))
        pygame.display.update()

    # game graphics input and looping
    try:
        manager.game_loop.events = pygame.event.get()
    except pygame.error:
        manager.game_loop.events = []
    for game_graphics in graphics.game_graphics_list:

        for event in manager.game_loop.events:
            game_graphics.on_input(event)
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        game_graphics.run_loopers()

    # server inputs and looping
    if manager.game_loop.server:
        for event in manager.game_loop.events:
            manager.game_loop.on_input(event)

        manager.game_loop.run_loopers()

    clock.tick(manager.game_loop.fps)
