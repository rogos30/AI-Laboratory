import random

import numpy as np
import matplotlib.pyplot as plt

from data import get_data, inspect_data, split_data

data = get_data()
inspect_data(data)

train_data, test_data = split_data(data)

def calculateMSE(x, y, predictions):
    MSE = 0
    for i in range(len(x) - 1):
        MSE += (y[i] - predictions[i]) ** 2
    MSE /= len(x)
    return MSE


# Simple Linear Regression
# predict MPG (y, dependent variable) using Weight (x, independent variable) using closed-form solution
# y = theta_0 + theta_1 * x - we want to find theta_0 and theta_1 parameters that minimize the prediction error

# We can calculate the error using MSE metric:
# MSE = SUM (from i=1 to n) (actual_output - predicted_output) ** 2

# get the columns
y_train = train_data['MPG'].to_numpy()
x_train = train_data['Weight'].to_numpy()

ones = np.ones((len(x_train)))
x = np.column_stack((ones, x_train))

y_test = test_data['MPG'].to_numpy()
x_test = test_data['Weight'].to_numpy()
ones = np.ones((len(x_test)))
xTest = np.column_stack((ones, x_test))

# TODO: calculate closed-form solution
theta_cfs = np.matmul(np.matmul(np.linalg.inv(np.matmul(np.transpose(x), x)), np.transpose(x)), y_train)
#theta_cfs_test = np.matmul(np.matmul(np.linalg.inv(np.matmul(np.transpose(xTest), xTest)), np.transpose(xTest)), y_test)

predictionsTrain = theta_cfs[0] + theta_cfs[1] * x_test
#predictionsTest = theta_cfs_test[0] + theta_cfs_test[1] * x_test
# TODO: calculate error
#MSEtrain = calculateMSE(x_train, y_train, predictionsTrain)
MSEtest = calculateMSE(x_test, y_test, predictionsTrain)

#print(MSEtrain)
print(MSEtest)

# plot the regression line
x = np.linspace(min(x_test), max(x_test), 100)
y = float(theta_cfs[0]) + float(theta_cfs[1]) * x
plt.plot(x, y)
plt.scatter(x_test, y_test)
plt.xlabel('Weight')
plt.ylabel('MPG')
plt.show()

# TODO: standardization
avgx = np.average(x_train)
avgy = np.average(y_train)
stanDevx = np.std(x_train)
stanDevy = np.std(y_train)
x_trainS = (x_train - avgx)/stanDevx
y_trainS = (y_train - avgy)/stanDevy
x_testS = (x_test - avgx)/stanDevx
y_testS = (y_test - avgy)/stanDevy
ones = np.ones(len(x_trainS))
xS = np.column_stack((ones, x_trainS))
ones = np.ones(len(x_testS))
xOnesS = np.column_stack((ones, x_testS))

# TODO: calculate theta using Batch Gradient Descent
gradientThetaTrain = np.random.rand(2)
gradientThetaTest = np.random.rand(2)


learningRate = 0.001
for i in range(10000):
    gradientThetaTrain = gradientThetaTrain - learningRate * 2/len(xS) * np.dot(xS.T, np.dot(xS, gradientThetaTrain) - y_trainS)
    gradientThetaTest = gradientThetaTest - learningRate * 2/len(xOnesS) * np.dot(xOnesS.T, np.dot(xOnesS, gradientThetaTest) - y_testS)

gradientThetaTrain[1] = gradientThetaTrain[1] * stanDevy / stanDevx
gradientThetaTrain[0] = avgy - gradientThetaTrain[1] * avgx
gradientThetaTrain = gradientThetaTrain.reshape(-1)
gradientThetaTest[1] = gradientThetaTest[1] * stanDevy / stanDevx
gradientThetaTest[0] = avgy - gradientThetaTest[1] * avgx
gradientThetaTest = gradientThetaTest.reshape(-1)

predictionsGradientTrain = gradientThetaTrain[0] + gradientThetaTrain[1] * x_test
#predictionsGradientTest = gradientThetaTest[0] + gradientThetaTest[1] * x_test




# TODO: calculate error
#MSEgradientTrain = calculateMSE(x_train, y_train, predictionsGradientTrain)
#print(MSEgradientTrain)
MSEgradientTest = calculateMSE(x_test, y_test, predictionsGradientTrain)
print(MSEgradientTest)


# plot the regression line
x = np.linspace(min(x_test), max(x_test), 100)
y = float(gradientThetaTrain[0]) + float(gradientThetaTrain[1]) * x
plt.plot(x, y)
plt.scatter(x_test, y_test)
plt.xlabel('Weight')
plt.ylabel('MPG')
plt.show()