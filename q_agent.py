import random

import numpy as np
from rl_base import Agent, Action, State
import os


class QAgent(Agent):

    def __init__(self, n_states, n_actions,
                 name='QAgent', initial_q_value=0.0, q_table=None):
        super().__init__(name)

        # hyperparams
        # TODO ustaw te parametry na sensowne wartości
        self.lr = 0.1                # współczynnik uczenia (learning rate)
        self.gamma = 0.9             # współczynnik dyskontowania
        self.epsilon = 1e-2           # epsilon (p-wo akcji losowej)
        self.eps_decrement = 5e-7     # wartość, o którą zmniejsza się epsilon po każdym kroku
        self.eps_min = 1e-5           # końcowa wartość epsilon, poniżej którego już nie jest zmniejszane

        self.action_space = [i for i in range(n_actions)]
        self.n_states = n_states
        self.q_table = q_table if q_table is not None else self.init_q_table(initial_q_value)

    def init_q_table(self, initial_q_value=0.):
        # TODO - utwórz tablicę wartości Q o rozmiarze [n_states, n_actions] wypełnioną początkowo wartościami initial_q_value
        q_table = np.array([[initial_q_value for _ in self.action_space] for _ in range(self.n_states)])
        return q_table

    def update_action_policy(self) -> None:
        # TODO - zaktualizuj wartość epsilon
        self.epsilon = max(self.eps_min, self.epsilon - self.eps_decrement)


    def choose_action(self, state: State) -> Action:

        assert 0 <= state < self.n_states, \
            f"Bad state_idx. Has to be int between 0 and {self.n_states}"

        # TODO - zaimplementuj strategię eps-zachłanną
        if random.random() <= self.epsilon:
            return Action(np.random.choice(self.action_space))
        else:
            return Action(np.argmax(self.q_table[state]))

    def learn(self, state: State, action: Action, reward: float, new_state: State, done: bool) -> None:
        # TODO - zaktualizuj q_table
        current_q = self.q_table[state, action]
        max_future_q = np.max(self.q_table[new_state])
        self.q_table[state, action] = (1 - self.lr) * current_q + self.lr * (reward + self.gamma * max_future_q)

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        np.save(path, self.q_table)

    def load(self, path):
        self.q_table = np.load(path)

    def get_instruction_string(self):
        return [f"Linearly decreasing eps-greedy: eps={self.epsilon:0.4f}"]
