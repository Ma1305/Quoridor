def is_consecutive_number(numbers, steps):
    numbers.sort()
    counter = 0
    for i in range(numbers[0], numbers[len(numbers)-1]+1, steps):
        if numbers[counter] != i:
            return False
        counter += 1
    return True


def is_path(position, board, pre_positions, direction):
    if direction == -1:
        pre_positions.append(position)
        availables = []
        if position - 17 < 0:
            return True
        elif position + 17 > 17*17:
            availables.append(position-17)
        else:
            availables.append(position + 17)
            availables.append(position - 17)
        if position % 17 == 0:
            availables.append(position-1)
        elif position % 17 == 1:
            availables.append(position+1)
        else:
            availables.append(position-1)
            availables.append(position+1)

        for pos in availables:
            if (pos + (pos - position)) not in pre_positions:
                if board[pos-1] == 0:
                    if board[(pos+(pos-position))-1] < 0:
                        return True
                    else:
                        if is_path((pos + (pos - position)), board, pre_positions, direction):
                            return True
        return False

    elif direction == 1:
        pre_positions.append(position)
        availables = []
        if position - 17 < 0:
            availables.append(position + 17)
        elif position + 17 > 17 * 17:
            return True
        else:
            availables.append(position + 17)
            availables.append(position - 17)
        if position % 17 == 0:
            availables.append(position - 1)
        elif position % 17 == 1:
            availables.append(position + 1)
        else:
            availables.append(position - 1)
            availables.append(position + 1)

        for pos in availables:
            if (pos + (pos - position)) not in pre_positions:
                if board[pos - 1] == 0:
                    if board[(pos + (pos - position)) - 1] < 0:
                        return True
                    else:
                        if is_path((pos + (pos - position)), board, pre_positions, direction):
                            return True
        return False


'''numbers = [0, 2, 4, 6]
print(is_consecutive_number(numbers, 2))'''