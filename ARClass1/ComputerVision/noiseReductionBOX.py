# ---------------------------------------------------------------
#Modules
import cv2
import numpy as np
font = cv2.QT_FONT_NORMAL

# ---------------------------------------------------------------
#Functions
def FilterImage(ksize, image, krad, krn):

    height, width, depth = image.shape

    # Frame trick avoid out-boundaries access
    frm = np.ones((height + krad * 2, width + krad * 2, depth))
    frm[krad:-krad, krad:-krad] = image

    # Filtered Image
    fil = np.zeros(image.shape)
    for i in range(0, height):
        for j in range(0, width):
            b = (frm[i:i+ksize, j:j+ksize, 0] * krn).sum()
            g = (frm[i:i+ksize, j:j+ksize, 1] * krn).sum()
            r = (frm[i:i+ksize, j:j+ksize, 2] * krn).sum()
            fil[i, j] = (b, g, r)
    
    return fil

def boxFilter(image, KernelSize):
    krad = int(KernelSize/2)                        # kernel radius
    krn = np.ones((KernelSize, KernelSize))
    krn = krn/krn.sum()                             # normalize kernel
    return FilterImage(KernelSize, image, krad, krn)

def gaussianKernel(krad):
    # Create an empty matrix
    ksize = krad*2 + 1
    krn = np.zeros((ksize, ksize))
    sig = krad/3

    #Fill kernel with gaussian values
    for i in range(0, ksize):
        for j in range(0, ksize):
            d = np.sqrt((krad - i)**2 + (krad - j)**2)  # Compute d
            krn[i, j] = np.exp(-(d**2/(2.0*sig**2)))    # Compute G(d)
    
    krn /= krn.sum()                                    #Normalize kernel, to make each color to sum 1 so to be normalized
    return krn

def gaussianFilter(image, kernelSize):
    krad = int(kernelSize/2)
    krn = gaussianKernel(krad)
    return FilterImage(kernelSize, image, krad, krn)


# ---------------------------------------------------------------
#Load image
path = "images/lena_noise.jpg"
img = cv2.imread(path, cv2.IMREAD_COLOR)
img2 = cv2.imread(path, cv2.IMREAD_COLOR)

img = img / 255.0
filtered = gaussianFilter(img, 9)

# ---------------------------------------------------------------
#Display image
winName = 'Filtered'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, filtered)

winName = 'Original'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, img2)

# ---------------------------------------------------------------
#Keep the screen showing
cv2.waitKey(0)