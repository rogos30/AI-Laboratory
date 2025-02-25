from connect4 import Connect4


class AlphaBetaAgent:
    def __init__(self, my_token='x'):
        self.my_token = my_token

    def decide(self, connect4):
        max_utility = float('-inf')
        best_move = None
        alpha = float('-inf')
        beta = float('inf')
        for column in connect4.possible_drops():
            new_board = Connect4(width=connect4.width, height=connect4.height)
            new_board.board = [row[:] for row in connect4.board]
            new_board.who_moves = connect4.who_moves
            new_board.drop_token(column)
            utility = self.value(new_board, 5, alpha, beta, 0)  # depth 3 for example
            # Heuristic evaluation for placing stones on corners
            if column in [0, connect4.width - 1]:
                utility += 0.2
            if utility > max_utility:
                max_utility = utility
                best_move = column
            alpha = max(alpha, utility)
        return best_move

    def value(self, connect4, depth, alpha, beta, maximize):
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
                value = max(value, self.value(new_board, depth - 1, alpha, beta, (maximize+1) % 2))
            else:
                value = min(value, self.value(new_board, depth - 1, alpha, beta, (maximize + 1) % 2))
        return value

    def utility(self, connect4):
        if connect4.game_over:
            if connect4.wins == self.my_token:
                return 1
            elif connect4.wins is None:
                return 0
            else:
                return -1
        return 0  # If game is not over, the utility is 0

    def get_ordered_moves(self, connect4):
        # Returns possible drops with moves on sides first
        sides = [0, connect4.width - 1]
        moves = sorted(connect4.possible_drops(), key=lambda x: x not in sides)
        return moves
