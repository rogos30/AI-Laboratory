import random
import time
from itertools import compress

import matplotlib.pyplot as plt

from data import *


def initial_population(individual_size, population_size):
    return [[random.choice([True, False]) for _ in range(individual_size)] for _ in range(population_size)]


def fitness(items, knapsack_max_capacity, individual):
    total_weight = sum(compress(items['Weight'], individual))
    if total_weight > knapsack_max_capacity:
        return 0
    return sum(compress(items['Value'], individual))


def choice_probability(population, populationFitness):
    populationChoiceProb = []
    populationFitnessSum = sum(populationFitness)
    for i in range(len(population)):
        populationChoiceProb.append(populationFitness[i] / populationFitnessSum)
    return populationChoiceProb


def choose_from_population(population, probabilities, selections_required):  # roulette wheel selection
    selections_made = 0
    new_population = []
    index = 0
    while selections_made < selections_required:
        if random.random() < probabilities[index]:
            new_population.append(population[index])
            selections_made += 1
        index = (index + 1) % len(probabilities)
    return new_population


def crossover(population):
    modified_population = []
    for i in range (0, len(population), 2):
        member = population[i]
        secondMember = population[i+1]
        firstHalf = member[:len(member)//2]
        secondHalf = secondMember[len(member)//2:]
        newMember = firstHalf + secondHalf
        modified_population.append(newMember)
        firstHalf = secondMember[:len(member)//2]
        secondHalf = member[len(member)//2:]
        newMember = firstHalf + secondHalf
        modified_population.append(newMember)
    return modified_population


def mutation(population):
    for i in range(len(population)):
        member = population[i]
        gene = random.randrange(len(member))
        member[gene] = not member[gene]


def sort_population(population, population_fitness):
    for i in range(len(population)):
        for j in range(len(population)-1):
            if population_fitness[j] > population_fitness[j+1]:
                population[j], population[j+1] = population[j+1], population[j]
                population_fitness[j], population_fitness[j+1] = population_fitness[j+1], population_fitness[j]


def update_population(population, population_fitness, new_population):
    sort_population(population, population_fitness)
    populationCopy = population.copy()
    for i in range(n_selection):
        populationCopy[i] = new_population[i]
    return populationCopy


def population_best(items, knapsack_max_capacity, population):
    best_individual = None
    best_individual_fitness = -1
    for individual in population:
        individual_fitness = fitness(items, knapsack_max_capacity, individual)
        if individual_fitness > best_individual_fitness:
            best_individual = individual
            best_individual_fitness = individual_fitness
    return best_individual, best_individual_fitness


items, knapsack_max_capacity = get_big()
print(items)

population_size = 100
generations = 2000
n_selection = 20
n_elite = 1

start_time = time.time()
best_solution = None
best_fitness = 0
population_history = []
best_history = []
population = initial_population(len(items), population_size)
for _ in range(generations):
    population_history.append(population)

    # TODO: implement genetic algorithm
    populationFitness = []
    for i in range(len(population)):
        populationFitness.append(fitness(items, knapsack_max_capacity, population[i]))

    populationChoiceProbability = choice_probability(population, populationFitness)
    chosenOnes = choose_from_population(population, populationChoiceProbability, n_selection)
    modifiedOnes = crossover(chosenOnes)
    mutation(modifiedOnes)
    population = update_population(population, populationFitness, modifiedOnes)

    best_individual, best_individual_fitness = population_best(items, knapsack_max_capacity, population)
    if best_individual_fitness > best_fitness:
        best_solution = best_individual
        best_fitness = best_individual_fitness
    best_history.append(best_fitness)

end_time = time.time()
total_time = end_time - start_time
print('Best solution:', list(compress(items['Name'], best_solution)))
print('Best solution value:', best_fitness)
print('Time: ', total_time)

# plot generations
x = []
y = []
top_best = 10
for i, population in enumerate(population_history):
    plotted_individuals = min(len(population), top_best)
    x.extend([i] * plotted_individuals)
    population_fitnesses = [fitness(items, knapsack_max_capacity, individual) for individual in population]
    population_fitnesses.sort(reverse=True)
    y.extend(population_fitnesses[:plotted_individuals])
plt.scatter(x, y, marker='.')
plt.plot(best_history, 'r')
plt.xlabel('Generation')
plt.ylabel('Fitness')
plt.show()
