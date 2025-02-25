from connect4 import Connect4


class MinMaxAgent:
    def __init__(self, my_token='x'):
        self.my_token = my_token

    def decide(self, connect4):
        best_move_rating = float('-inf')
        best_move = None
        for drop in connect4.possible_drops():
            new_board = Connect4(width=connect4.width, height=connect4.height)
            new_board.board = [row[:] for row in connect4.board]
            new_board.who_moves = connect4.who_moves
            new_board.drop_token(drop)
            move_rating = self.value(new_board, 5, 0)
            # Heuristic evaluation for placing stones on corners
            if drop not in [0, connect4.width - 1]:
                move_rating = min(1, move_rating + 0.2)
            if move_rating > best_move_rating:
                best_move_rating = move_rating
                best_move = drop
        return best_move

    def value(self, connect4, depth, maximize):
        if depth == 0 or connect4.game_over:
            return self.utility(connect4)
        if maximize == 1:
            value = float('-inf')
        else:
            value = float('inf')
        for column in self.get_ordered_moves(connect4):
            new_board = Connect4(width=connect4.width, height=connect4.height)
            new_board.board = [row[:] for row in connect4.board]
            new_board.who_moves = connect4.who_moves
            new_board.drop_token(column)
            if maximize == 1:
                value = max(value, self.value(new_board, depth - 1, (maximize+1) % 2))
            else:
                value = min(value, self.value(new_board, depth - 1, (maximize + 1) % 2))
        return value

    def utility(self, connect4):
        if connect4.game_over:
            if connect4.wins == self.my_token:
                return 1
            elif connect4.wins is None:
                return 0
            else:
                return -1
        return 0

    def get_ordered_moves(self, connect4):
        # Returns possible drops with moves on sides first
        sides = [0, connect4.width - 1]
        moves = sorted(connect4.possible_drops(), key=lambda x: x not in sides)
        return moves
