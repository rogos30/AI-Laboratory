import copy
import math

import numpy as np


def calculate_distance(data1, data2):
    distance = 0
    for i in range(len(data1)):
        distance += (data1[i] - data2[i]) ** 2
    return math.sqrt(distance)


def initialize_centroids_forgy(data, k):
    # TODO implement random initialization
    # returns a list of k centroids
    selections = np.random.choice(data.shape[0], k, replace=False)
    centroids = []
    for i in selections:
        centroids.append(copy.deepcopy(data[i]).tolist())
    print(np.array(centroids))
    return np.array(centroids)


def initialize_centroids_kmeans_pp(data, k):
    # TODO implement kmeans++ initizalization
    # returns a list of k centroids
    selections = np.random.choice(data.shape[0], 1).tolist()
    centroids = [copy.deepcopy(data[selections[0]]).tolist()]
    for _ in range(k-1):
        index_to_add = -1
        max_distance = -1
        for i in range(len(data)):
            distance = 0
            for j in selections:
                distance += calculate_distance(data[i], data[j])
            if distance > max_distance:
                max_distance = distance
                index_to_add = i
        centroids.append(copy.deepcopy(data[index_to_add]).tolist())
        selections.append(index_to_add)
    print(np.array(centroids))
    return np.array(centroids)


def assign_to_cluster(data, centroids):
    # TODO find the closest cluster for each data point
    # returns a list which contains an index of a cluster for each data point
    # cluster_indexes = []
    # for i in range(len(centroids)):
    #     cluster_indexes.append(i)
    #
    # assignments = []
    # for i in range(len(data)):
    #     min_distance = float('inf')
    #     closest_centroid_index = -1
    #     for j in range(len(centroids)):
    #         distance = calculate_distance(data[i], centroids[j])
    #         if distance < min_distance:
    #             min_distance = distance
    #             closest_centroid_index = j
    #     assignments.append(cluster_indexes.index(closest_centroid_index))
    # print(assignments)
    # return assignments
    assignments = []
    for d in data:
        distance = [calculate_distance(d, c) for c in centroids]
        distance = np.array(distance).argmin()
        assignments.append(distance)
    print(assignments)
    return np.array(assignments)


def update_centroids(data, assignments):
    # TODO find new centroids based on the assignments
    centroids = set(assignments)
    new_centroids = []
    for i in centroids:
        new_centroids.append([])
        for j in range(4):
            new_centroids[i].append(0)
        counter = 0
        for j in range(len(assignments)):
            if assignments[j] == i:
                counter += 1
                for k in range(4):
                    new_centroids[i][k] += data[j][k]
        for j in range(4):
            new_centroids[i][j] /= counter

    return np.array(new_centroids)


def mean_intra_distance(data, assignments, centroids):
    return np.sqrt(np.sum((data - centroids[assignments, :])**2))


def k_means(data, num_centroids, kmeansplusplus = False):
    # centroids initialization
    if kmeansplusplus:
        centroids = initialize_centroids_kmeans_pp(data, num_centroids)
    else: 
        centroids = initialize_centroids_forgy(data, num_centroids)

    assignments = assign_to_cluster(data, centroids)
    for i in range(100): # max number of iteration = 100
        print(f"Intra distance after {i} iterations: {mean_intra_distance(data, assignments, centroids)}")
        centroids = update_centroids(data, assignments)
        new_assignments = assign_to_cluster(data, centroids)
        if np.all(new_assignments == assignments): # stop if nothing changed
            break
        else:
            assignments = new_assignments

    return new_assignments, centroids, mean_intra_distance(data, new_assignments, centroids)         

