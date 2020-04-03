import cv2
import numpy as np

# ---------------------------------------------------------------
# Exercise 2 Functions ---------------------------------------
def gaussianFilter(img):
    # Kernel
    ksize = 11
    krad = int(ksize/2)
    krn = np.ones((ksize, ksize))
    sig = krad / 3

    for i in range(ksize):
        for j in range(ksize):
            d = np.sqrt(pow((i - krad), 2) + pow((j - krad), 2))
            krn[i, j] = np.exp(-(pow(d, 2) / (2 * pow(sig, 2))))

    # Normalize
    krn = krn / krn.sum()
    height, width = img.shape

    # Img Frame (not to go out-bounds)
    frm = np.ones((height + krad * 2, width + krad * 2))
    frm[krad:-krad, krad:-krad] = img

    # Result
    result = np.zeros(img.shape)
    for i in range(height):
        for j in range(width):           
            result[i, j] = (frm[i:i + ksize, j:j + ksize]*krn[:, :]).sum(axis = (0, 1))

    return result

# Exercise 1 Functions ---------------------------------------
def Conv(img, krn, ksize, krad):
    # Frame
    height, width = img.shape
    frm = np.ones((height + krad*2, width + krad*2))
    frm[krad: -krad, krad: -krad] = img

    # Result
    result = np.zeros((height, width))
    for i in range (0, height):
        for j in range (0,width):
            result[i,j] = (frm[i:i+ksize, j:j+ksize] * krn).sum()

    return result

def Sobel(img):
    # Kernel
    ksize = 3
    krad = int(ksize/2)
    krn = np.array([[-1,0,1], [-2,0,2], [-1,0,1]])
    krn2 = np.transpose(krn)

    # Gradient & Result
    GradX = Conv(img, krn, ksize, krad)
    GradY = Conv(img, krn2, ksize, krad)
    return np.sqrt(pow(GradX, 2) + pow(GradY, 2))


# EXERCISE 1 ###########################################################
def exercise1():
    original = cv2.imread("bcn_exercise1_image.png", cv2.IMREAD_COLOR)
    assert original is not None
    cv2.imshow("Original", original)

    grayscale = cv2.imread("bcn_exercise1_image.png", cv2.IMREAD_GRAYSCALE)
    assert grayscale is not None
    cv2.imshow("Grayscale", grayscale)

    # TO DO: Insert exercise 1 code here
    # Normalize Gray Image
    grayscale = grayscale/255.0

    # Apply Sobel Filter & Normalize
    img = Sobel(grayscale)
    img /= img.max()

    # Invert for Edges to be Black
    img = 1 - img

    # Applying Alpha & Edge Highlight
    result = original
    A = 0.25
    OneMinusA = 1 - A
    height, width, _ = result.shape
    for i in range(0, height):
        for j in range(0, width):
            result[i, j, 0] = ((original[i, j, 0] * A) + (OneMinusA * 255)) * (pow(img[i][j], 2))
            result[i, j, 1] = ((original[i, j, 1] * A) + (OneMinusA * 255)) * (pow(img[i][j], 2))
            result[i, j, 2] = ((original[i, j, 2] * A) + (OneMinusA * 255)) * (pow(img[i][j], 2))
    
    cv2.imshow("Result", result)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# EXERCISE 2 ###########################################################
def exercise2():
    image = cv2.imread("bcn_exercise2_image.png", cv2.IMREAD_GRAYSCALE)
    assert image is not None
    cv2.imshow("Original", image)

    # TO DO: Insert exercise 2 code here
    image = image / 255.0 # Normalize

    # Apply Filters
    gauss = gaussianFilter(image)
    sob = Sobel(gauss)

    # Result
    sob = sob/sob.max()
    sobInverted = 1 - sob
    
    height, width = image.shape
    result = image
    for i in range (height):
        for j in range (width):
            result[i][j] = pow(sobInverted[i][j], 2) * gauss[i][j]

    # Show Images
    cv2.imshow("Original", image)
    cv2.imshow("Gaussian", gauss)
    cv2.imshow("Sobel", sob)
    cv2.imshow("Result", result/result.max())
    cv2.waitKey(0)


# MAIN PROGRAM #########################################################
def main():
    exercise1()
    exercise2()

main()
