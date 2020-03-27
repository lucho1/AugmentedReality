import numpy as np
import cv2

# This are the numpy exrcises in the campus
# Ex1
def ex1():
    arr = np.zeros(shape = (1, 10)) # function zeros() creates floats
    print(arr)

# Ex2
def ex2():
    arr = np.zeros(shape = (1, 10)) # This is the same than np.zeros(10), and in the next line you'll access as arr[4]
    arr[0, 4] = 1.0 # needed because shape creates a 2D array, so so you need to specify here 1st the dimension, then the access
    print(arr)

# Ex 3
def ex3():
    arr = np.arange(10.0, 50.0)
    print(arr)

# Ex 4
def ex4():
    arr = np.arange(1.0, 10.0)
    arr = arr.reshape(3, 3)
    print(arr)

# Ex 5
def ex5():
    arr = np.arange(1.0, 10.0)
    arr = arr.reshape(3, 3)
    arr = np.flip(arr, 1) # this is to flip array, if no axis (2nd arg.) is defined, per default is vertical + horizontal
    print(arr)

# Ex 6
def ex6():
    arr = np.arange(1.0, 10.0)
    arr = arr.reshape(3, 3)
    arr = np.flip(arr, 0) # 0 would be the fvertical axis
    print(arr)

# Ex 7
def ex7():
    arr = np.identity(3)
    arr = arr.reshape(3, 3)
    print(arr)

# Ex 8
np.random.seed(101)
def ex8(multiplier = 10.0):
    arr = np.random.random_sample((3, 3)) * multiplier
    print(arr)

# Ex 9
def ex9(multiplier = 10.0):
    #arr = np.random.random_sample((1, 10)) * multiplier
    arr = np.random.randint((10, 100, 10))
    mean = np.mean(arr)
    print(arr)
    print("MEAN: ")
    print(mean)

# Ex 10
def ex10():
    arr = np.ones((5, 5))
    arr[1:-1, 1:-1] = 0
    print (arr)

# Ex 11
def ex11():
    arr = np.ones((5, 5))
    arr += np.arange(5)
    print(arr)

# Ex 12
def ex12():
    arr = np.float64(np.random.randint(0, 10, 9))
    arr = arr.reshape((3, 3))
    arr -= np.mean(arr)

# The next exercises are not done because they are very similar

# Ex 15
def ex15():
    a = np.random.uniform(1.0, 1.0, 25)
    a = a.reshape((5, 5))
    index = np.absolute(a - 0.5).argmin()
    a = a.flatten()
    print(a[index])

def ex16():
    a = np.random.randint(0, 10, 9)
    a = a.reshape((3, 3))
    result = a[a > 5]
    print(result)
    print(len(result))

def ex17():
    img = np.tile(np.linspace(0, 255, 64), (64, 1))
    cv2.imshow("image", np.uint8(img))
    cv2.waitKey(0)

def ex17_2ndV():
    img = np.zeros((64, 64))
    grad = np.arange(0.0, 1.0, 1.0/64.0)
    img += grad
    cv2.imshow("image", img)
    cv2.waitKey(0)

def ex19():
    img = 255 * np.ones((64, 64, 3), np.uint8)
    img[:, :, 0] = 0.0
    cv2.imshow("image", img)
    cv2.waitKey(0)

# Same than before, exercise won't be performed due to their similarity

def ex22():
    img = cv2.imread("images/sonic.jpg", cv2.IMREAD_ANYCOLOR)
    img[:, :100:2] = 0.0
    cv2.imshow("image", img)
    cv2.waitKey(0)



#ex5()
